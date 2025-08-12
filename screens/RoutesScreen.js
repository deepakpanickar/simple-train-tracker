// screens/RoutesScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../theme';

export default function RoutesScreen({ routes, onSelectRoute, getDelayStyle, getDelayText }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIconGrid}>
            <View style={styles.gridDot} />
            <View style={styles.gridDot} />
            <View style={styles.gridDot} />
            <View style={styles.gridDot} />
          </View>
          <Text style={styles.headerTitle}>My Routes</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.routesList}>
          {routes.map((route) => (
            <View key={route.id} style={[styles.routeCard, { backgroundColor: 'white' }]}>
              <TouchableOpacity style={styles.routeCardContent} onPress={() => onSelectRoute(route)} activeOpacity={0.8}>
                <View style={styles.routeInfo}>
                  <View style={styles.routeHeader}>
                    <Text style={styles.routeFrom}>{route.from}</Text>
                  </View>
                  <Text style={styles.routeDetails}>{route.scheduledTime} → {route.to}</Text>
                </View>
                <View style={[styles.routeDelayBadge, getDelayStyle(route.delay)]}>
                  <Text style={[styles.routeDelayText, getDelayStyle(route.delay)]}>
                    {getDelayText(route.delay, route.status)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}