import React, { useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';

interface CustomToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;  // in milliseconds
  onDismiss?: () => void;
  buttons?: {
    text: string;
    onPress: () => void;
    style?: 'cancel' | 'default' | 'destructive';
  }[];
}

export default function CustomToast({ message, type = 'info', duration = 3000, onDismiss, buttons }: CustomToastProps) {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onDismiss && onDismiss());
    }, duration);

    return () => clearTimeout(timer);
  }, [opacity, duration, onDismiss]);

  const backgroundColor =
    type === 'success' ? '#4caf50' :
    type === 'error' ? '#f44336' :
    '#2196f3';  // info

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor }]}>
      <Text style={styles.text}>{message}</Text>
      {buttons && buttons.length > 0 && (
        <View style={styles.buttonsContainer}>
          {buttons.map((btn, index) => (
           <TouchableOpacity
  key={index}
  onPress={() => {
    console.log(`Button "${btn.text}" pressed`);
    if (btn.onPress) btn.onPress();
  }}
  style={[styles.button, btn.style === 'cancel' ? styles.cancelButton : null]}
>
  <Text style={styles.buttonText}>{btn.text}</Text>
</TouchableOpacity>

          ))}
        </View>
      )}
      {!buttons && (
        <TouchableOpacity onPress={onDismiss}>
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    flexWrap: 'wrap',
  },
  text: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  dismissText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 12,
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  button: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
