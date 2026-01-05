import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';

/**
 * LoginScreen Component
 * 
 * Implements a secure two-step authentication system:
 * 1. Email verification against authorized database
 * 2. 6-digit verification code check
 * 
 * Features:
 * - Rate limiting (3 attempts max)
 * - Temporary blocking (15 minutes)
 * - Code expiration (10 minutes)
 * - Session handling
 */
const LoginScreen = ({ onLoginSuccess }) => {
    // --- State Management ---
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('email'); // 'email' | 'code'

    // Security State
    const [attempts, setAttempts] = useState(0);
    const [blockedUntil, setBlockedUntil] = useState(null);
    const [codeExpiry, setCodeExpiry] = useState(null);

    // Constants
    const MAX_ATTEMPTS = 3;
    const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes in ms
    const CODE_EXPIRY_DURATION = 10 * 60 * 1000; // 10 minutes in ms

    // Check for existing block on mount
    useEffect(() => {
        checkBlockStatus();
    }, []);

    const checkBlockStatus = async () => {
        const storedBlock = await AsyncStorage.getItem('auth_blocked_until');
        if (storedBlock) {
            const blockTime = new Date(parseInt(storedBlock));
            if (blockTime > new Date()) {
                setBlockedUntil(blockTime);
            } else {
                await AsyncStorage.removeItem('auth_blocked_until');
                setBlockedUntil(null);
                setAttempts(0);
            }
        }
    };

    /**
     * Step 1: Handle Email Submission
     * Validates email and checks against authorized_users table
     */
    const handleEmailSubmit = async () => {
        // Basic validation
        if (!email.trim()) {
            Alert.alert('Erreur', 'Veuillez entrer votre email');
            return;
        }

        // Check if currently blocked
        if (blockedUntil && new Date() < blockedUntil) {
            const minutesLeft = Math.ceil((blockedUntil - new Date()) / 60000);
            Alert.alert('Compte Bloqué', `Trop de tentatives. Réessayez dans ${minutesLeft} minutes.`);
            return;
        }

        setLoading(true);

        try {
            const formattedEmail = email.trim().toLowerCase();

            // Check authorization in Supabase
            const { data, error } = await supabase
                .from('authorized_users')
                .select('*')
                .eq('email', formattedEmail)
                .single();

            // Log attempt (Security requirement)
            await supabase.from('login_logs').insert({
                email: formattedEmail,
                success: !!data && !error && data.is_active,
                ip_address: 'unknown', // React Native limitations
                user_agent: Platform.OS + ' ' + Platform.Version
            });

            if (error || !data) {
                // Security: Don't reveal if email exists or not explicitly, 
                // but for this internal app, clearer messages might be preferred. 
                // We'll stick to a generic error for unauthorized users.
                Alert.alert('Erreur', "Cet email n'est pas autorisé ou n'existe pas.");
                setLoading(false);
                return;
            }

            if (!data.is_active) {
                Alert.alert('Accès Refusé', "Ce compte a été désactivé. Contactez l'administrateur.");
                setLoading(false);
                return;
            }

            // Generate 6-digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedCode(code);

            // Set expiration
            const expiry = new Date(new Date().getTime() + CODE_EXPIRY_DURATION);
            setCodeExpiry(expiry);

            // In production, you would call a Supabase Edge Function here to send the email
            // For MVP/Demo: Alert the code
            Alert.alert(
                'Code de Vérification',
                `Votre code est: ${code}\n(En production ce code serait envoyé par email)`,
                [{ text: 'OK', onPress: () => { } }]
            );

            setStep('code');
        } catch (err) {
            console.error(err);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Step 2: Handle Verification Code
     * Verifies the code and establishes session
     */
    const handleCodeSubmit = async () => {
        // Check block status again
        if (blockedUntil && new Date() < blockedUntil) {
            Alert.alert('Bloqué', 'Veuillez attendre la fin du blocage.');
            return;
        }

        // Check expiration
        if (codeExpiry && new Date() > codeExpiry) {
            Alert.alert('Expiré', 'Le code a expiré. Veuillez recommencer.');
            setStep('email');
            return;
        }

        // Verify Code
        if (verificationCode === generatedCode) {
            // Success!
            setLoading(true);
            try {
                // 1. Update last_login
                await supabase
                    .from('authorized_users')
                    .update({ last_login: new Date() })
                    .eq('email', email.toLowerCase());

                // 2. Log success
                await supabase.from('login_logs').insert({
                    email: email.toLowerCase(),
                    success: true,
                    user_agent: 'Verification Success'
                });

                // 3. Create Session
                const sessionData = {
                    email: email.toLowerCase(),
                    loginDate: new Date().toISOString(),
                    isAuthenticated: true
                };
                await AsyncStorage.setItem('userSession', JSON.stringify(sessionData));

                // 4. Notify Parent
                if (onLoginSuccess) {
                    onLoginSuccess(email.toLowerCase());
                }

            } catch (error) {
                console.error('Login confirm error:', error);
                Alert.alert('Erreur', 'Impossible de finaliser la connexion.');
            } finally {
                setLoading(false);
            }
        } else {
            // Failure
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            // Log failure
            await supabase.from('login_logs').insert({
                email: email.toLowerCase(),
                success: false,
                user_agent: `Verification Failed (Attempt ${newAttempts})`
            });

            if (newAttempts >= MAX_ATTEMPTS) {
                const blockTime = new Date(new Date().getTime() + BLOCK_DURATION);
                setBlockedUntil(blockTime);
                await AsyncStorage.setItem('auth_blocked_until', blockTime.getTime().toString());
                Alert.alert('Compte Bloqué', 'Trop de tentatives échouées. Compte bloqué pour 15 minutes.');
            } else {
                Alert.alert('Code Incorrect', `Code invalide. ${MAX_ATTEMPTS - newAttempts} essais restants.`);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.formContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.logoText}>NOVADIS</Text>
                        <Text style={styles.subtitle}>Compte Rendu d'Intervention</Text>
                    </View>

                    {/* Step 1: Email Input */}
                    {step === 'email' && (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email Professionnel</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="ex: nom@novadis.com"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                editable={!loading}
                            />
                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleEmailSubmit}
                                disabled={loading || !!blockedUntil}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.buttonText}>Recevoir le code</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Step 2: Code Verification */}
                    {step === 'code' && (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Code de Vérification</Text>
                            <Text style={styles.helperText}>
                                Un code a été envoyé à {email}
                            </Text>
                            <TextInput
                                style={[styles.input, styles.codeInput]}
                                placeholder="123456"
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                                keyboardType="number-pad"
                                maxLength={6}
                                editable={!loading}
                            />

                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleCodeSubmit}
                                disabled={loading || !!blockedUntil}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.buttonText}>Se Connecter</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setStep('email');
                                    setVerificationCode('');
                                }}
                                style={styles.backButton}
                            >
                                <Text style={styles.backButtonText}>Retour / Changer d'email</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Blocked Message */}
                    {blockedUntil && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>
                                Accès temporairement bloqué jusqu'à {blockedUntil.toLocaleTimeString()}
                            </Text>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0066CC',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    inputContainer: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F0F2F5',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E1E4E8',
    },
    codeInput: {
        textAlign: 'center',
        letterSpacing: 5,
        fontSize: 24,
        fontWeight: 'bold',
    },
    helperText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#0066CC',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#0066CC',
        fontSize: 14,
    },
    errorContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#FFE5E5',
        borderRadius: 5,
    },
    errorText: {
        color: '#D8000C',
        textAlign: 'center',
    }
});

export default LoginScreen;
