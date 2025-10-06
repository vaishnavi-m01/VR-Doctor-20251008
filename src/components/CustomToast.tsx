import React, { useEffect, useState, useRef } from 'react';
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
  const opacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current; // slide from above

  useEffect(() => {
    // Animate in: fade in + slide down
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      // Animate out: fade out + slide up
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onDismiss) onDismiss();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss, opacity, slideAnim]);

 const backgroundColor =
  type === 'success' ? 'rgb(240, 253, 244)' :  // a very light green background (bg-green-50)
  type === 'error' ? '#f44336' :                // keep the error red as is, or customize if needed
  'rgb(187, 247, 208)';                         // a light green shade from border-green-200 for info


  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.text}>{message}</Text>
      {buttons && buttons.length > 0 && (
        <View style={styles.buttonsContainer}>
          {buttons.map((btn, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
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
    top: 60,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    // Box shadow equivalent for React Native using shadow props:
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    flexWrap: 'wrap',
    zIndex: 1000,
    backgroundColor: 'rgb(240, 253, 244)', // bg-green-50 with full opacity
    borderColor: 'rgb(187, 247, 208)', // border-green-200 with full opacity
    borderWidth: 1, // Assuming you want border width for border-green-200
  },
  text: {
    color: 'black',
    fontSize: 16,
    flex: 1,
  },
  dismissText: {
    color: 'black',
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
   backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 4,
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  buttonText: {
    color: 'red',
    fontWeight: '600',
  },
});

