// screens/AddRouteScreen.js
import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, COLORS } from '../theme';

const BOTTOM_NAV_HEIGHT = 80; // matches styles.container old paddingBottom

export default function AddRouteScreen({
  searchText,
  setSearchText,
  selectedStation,
  setSelectedStation,
  ukStations,
  getCurrentDepartures,
  addRoute,
  navigateToScreen,
}) {
  const inputRef = useRef(null);

  const suggestions = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return [];
    return ukStations
      .filter((st) => st.toLowerCase().includes(q))
      .filter((st) => st.toLowerCase() !== q) // don’t show exact typed value
      .slice(0, 8);
  }, [searchText, ukStations]);

  // helper to add minutes to "HH:MM"
  const addMinutes = (hhmm, mins) => {
    const [h, m] = hhmm.split(':').map(Number);
    const total = h * 60 + m + mins;
    const nh = Math.floor((total % (24 * 60)) / 60);
    const nm = total % 60;
    return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
  };

  // ensure at least 10 departures to test scrolling
  const departures = useMemo(() => {
    if (!selectedStation) return [];
    const base = getCurrentDepartures();
    if (base.length >= 10) return base;

    const filled = [...base];
    let i = 0;

    if (base.length === 0) {
      // edge case: no data for station – synthesize
      while (filled.length < 10) {
        filled.push({
          destination: 'Sample Destination',
          time: addMinutes('10:00', i * 10),
          platform: String(((i % 8) + 1)),
          duration: `${60 + i * 5}m`,
        });
        i++;
      }
      return filled;
    }

    // duplicate & tweak to reach 10
    while (filled.length < 10) {
      const src = base[i % base.length];
      filled.push({
        ...src,
        time: addMinutes(src.time, 5 * (Math.floor(i / base.length) + 1)),
      });
      i++;
    }
    return filled;
  }, [selectedStation, getCurrentDepartures]);

  return (
    // Override container bottom padding so we don't see the grey strip
    <KeyboardAvoidingView
      style={[styles.container, { paddingBottom: 0 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigateToScreen('routes')}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Route</Text>
        </View>
      </View>

      {/* Single scroll context for search + departures */}
      <ScrollView
        style={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        // Add padding INSIDE the scrollable content so it sits under the nav (not visible as a gap)
        contentContainerStyle={{ paddingBottom: BOTTOM_NAV_HEIGHT + 16 }}
      >
        <Text style={styles.inputLabel}>Search Station</Text>
        <TextInput
          ref={inputRef}
          style={styles.simpleSearchInput}
          placeholder="Type to search stations..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={COLORS.gray}
          autoFocus={false}
          blurOnSubmit={false}
          returnKeyType="search"
        />

        {suggestions.length > 0 && (
          <View style={styles.simpleList}>
            {suggestions.map((station) => (
              <TouchableOpacity
                key={station}
                style={styles.simpleListItem}
                onPress={() => {
                  setSearchText(station);      // reflect in input
                  setSelectedStation(station); // drives departures
                  // Hide keyboard on selection
                  inputRef.current?.blur();
                  Keyboard.dismiss();
                }}
              >
                <Text>{station}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* No “Selected: …” strip — the input already shows it */}

        {selectedStation ? (
          <>
            <Text style={styles.departuresTitle}>Departures from {selectedStation}</Text>
            <View style={styles.trainsList}>
              {departures.map((train, idx) => (
                <View key={`${train.destination}-${train.time}-${idx}`} style={styles.trainCard}>
                  <View style={styles.trainInfo}>
                    <View style={styles.trainHeader}>
                      <Ionicons name="train" size={16} color={COLORS.gray} />
                      <Text style={styles.trainDestination}>{train.destination}</Text>
                    </View>
                    <Text style={styles.trainDetails}>
                      {train.time} • Platform {train.platform} • {train.duration}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addRoute(train)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="add-circle" size={16} color={COLORS.white} />
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {/* Extra tiny visual buffer so the last card isn't glued to the nav */}
        <View style={{ height: 8 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}