import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from './config/firebase';

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErro('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      onSuccess();
    } catch (e) {
      setErro('E-mail ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      {erro ? <Text style={styles.error}>{erro}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        activeOpacity={0.8}
        disabled={loading}
      >
        <LinearGradient
          colors={['#4CAF50', '#2E7D32']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setErro('');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      onSuccess();
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        setErro('E-mail já cadastrado');
      } else if (e.code === 'auth/invalid-email') {
        setErro('E-mail inválido');
      } else if (e.code === 'auth/weak-password') {
        setErro('A senha deve ter pelo menos 6 caracteres');
      } else {
        setErro('Erro ao criar conta');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      {erro ? <Text style={styles.error}>{erro}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        activeOpacity={0.8}
        disabled={loading}
      >
        <LinearGradient
          colors={['#4CAF50', '#2E7D32']}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Criar Conta'}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const router = useRouter();

  const handleSuccess = () => {
    router.replace('/'); // Redireciona para o app após login/cadastro
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#6C47FF', '#4F8CFF']} style={styles.header}>
        <Text style={styles.title}>{mode === 'login' ? 'Entrar' : 'Criar Conta'}</Text>
        <Text style={styles.subtitle}>
          {mode === 'login' ? 'Acesse sua conta para continuar' : 'Preencha os campos para se cadastrar'}
        </Text>
      </LinearGradient>
      <View style={styles.formWrapper}>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.switchButton, mode === 'login' && styles.activeButton]}
            onPress={() => setMode('login')}
          >
            <Text style={mode === 'login' ? styles.activeText : styles.inactiveText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchButton, mode === 'register' && styles.activeButton]}
            onPress={() => setMode('register')}
          >
            <Text style={mode === 'register' ? styles.activeText : styles.inactiveText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
        {mode === 'login' ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  switchButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginHorizontal: 8,
    backgroundColor: '#E0E0E0',
  },
  activeButton: {
    backgroundColor: '#6C47FF',
  },
  activeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  inactiveText: {
    color: '#555',
    fontSize: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#22223B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#22223B',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#22223B',
  },
  button: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: '#D32F2F',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 