import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../app/config/firebase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setErro('');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      router.replace('/login'); // Redireciona para login após cadastro
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
    <View style={styles.container}>
      <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.header}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha os campos para se cadastrar</Text>
      </LinearGradient>
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
        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={styles.link}>Já tem conta? Entrar</Text>
        </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  form: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
  link: {
    color: '#2E7D32',
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
}); 