// screens/TrackerScreen.js
import React from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, COLORS } from '../theme';

export default function TrackerScreen({ selectedRoute, pulseAnim }) {
  if (!selectedRoute) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No route selected</Text>
      </View>
    );
  }

  const stations = [
    { name: 'London Paddington', status: 'completed' },
    { name: 'Slough', status: 'completed' },
    { name: 'Reading', status: 'current' },
    { name: 'Swindon', status: 'upcoming' },
    { name: 'Bath Spa', status: 'upcoming' },
    { name: 'Bristol Temple Meads', status: 'upcoming' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {/* Header remains generous */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="checkmark" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.headerTitle}>UK Train Tracker</Text>
        </View>
      </View>

      {/* Journey card (keep header->card spacing) */}
      <View style={[styles.cardContainer, { marginTop: 8, marginBottom: 8 /* tighten gap to progress */ }]}>
        <View style={styles.journeyCard}>
          <View style={styles.journeyHeader}>
            <View style={styles.stationInfo}>
              <Text style={styles.stationName}>{selectedRoute.from.split(' ')[0]}</Text>
              <Text style={styles.stationCode}>{selectedRoute.fromCode}</Text>
            </View>
            <Ionicons name="arrow-forward" size={32} color={COLORS.white} />
            <View style={styles.stationInfo}>
              <Text style={styles.stationName}>{selectedRoute.to.split(' ')[0]}</Text>
              <Text style={styles.stationCode}>{selectedRoute.toCode}</Text>
            </View>
          </View>

          <View style={styles.journeyTimes}>
            <Text style={styles.scheduledTime}>{selectedRoute.scheduledTime}</Text>
            <Text style={styles.actualTime}>{selectedRoute.actualTime}</Text>
            <View style={[styles.delayBadge, { backgroundColor: selectedRoute.delay > 0 ? COLORS.orange : COLORS.green }]}>
              <Text style={styles.delayText}>{selectedRoute.delay > 0 ? `+${selectedRoute.delay} MIN` : 'ON TIME'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Progress card (slightly closer to journey card) */}
      <View style={[styles.cardContainer, { marginTop: 4 }]}>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Journey Progress</Text>
            <View style={styles.timeRemaining}>
              <Text style={styles.timeNumber}>22</Text>
              <Text style={styles.timeLabel}>min</Text>
            </View>
          </View>

          <View style={styles.stationsContainer}>
            {stations.map((station, index) => (
              <View key={station.name} style={styles.stationRow}>
                <View style={styles.stationIndicatorContainer}>
                  <Animated.View
                    style={[
                      styles.stationIndicator,
                      {
                        backgroundColor:
                          station.status === 'completed' ? COLORS.green :
                          station.status === 'current' ? COLORS.orange : COLORS.white,
                        borderColor:
                          station.status === 'completed' ? COLORS.green :
                          station.status === 'current' ? COLORS.orange : COLORS.gray,
                        transform: station.status === 'current' ? [{ scale: pulseAnim }] : [{ scale: 1 }],
                      },
                    ]}
                  >
                    {station.status === 'completed' && <Ionicons name="checkmark" size={10} color={COLORS.white} />}
                    {station.status === 'current' && <Ionicons name="train" size={10} color={COLORS.white} />}
                  </Animated.View>
                  {index < stations.length - 1 && (
                    <View style={[styles.stationLine, { backgroundColor: station.status === 'completed' ? COLORS.green : COLORS.lightGray }]} />
                  )}
                </View>

                <Text
                  style={[
                    styles.stationNameText,
                    {
                      color: station.status === 'current' ? COLORS.orange :
                             station.status === 'completed' ? COLORS.green : COLORS.gray,
                      fontWeight: station.status === 'current' ? '600' : '500',
                    },
                  ]}
                >
                  {station.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}