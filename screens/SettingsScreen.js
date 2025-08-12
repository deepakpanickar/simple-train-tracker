// screens/SettingsScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, COLORS } from '../theme';

const BOTTOM_NAV_HEIGHT = 80;

export default function SettingsScreen({ settings, toggleSetting, navigateToScreen }) {
  return (
    <View style={[styles.container, { paddingBottom: 0 }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigateToScreen('routes')}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: BOTTOM_NAV_HEIGHT + 16 }}
      >
        {/* Notifications */}
        <View style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="notifications" size={20} color={COLORS.primary} />
            <Text style={styles.settingsCardTitle}>Notifications</Text>
          </View>

          <View style={styles.settingsList}>
            <SettingToggle
              label="Push Notifications"
              icon="phone-portrait"
              value={settings.pushNotifications}
              onToggle={() => toggleSetting('pushNotifications')}
            />

            <SettingToggle
              label="Delay Alerts"
              icon="time"
              value={settings.delayAlerts}
              onToggle={() => toggleSetting('delayAlerts')}
            />

            <SettingToggle
              label="Platform Changes"
              icon="swap-horizontal"
              value={settings.platformChanges}
              onToggle={() => toggleSetting('platformChanges')}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.settingsCard}>
          <View className="cardHeader" style={styles.cardHeader}>
            <Ionicons name="information-circle" size={20} color={COLORS.primary} />
            <Text style={styles.settingsCardTitle}>About</Text>
          </View>

          <View style={styles.aboutList}>
            <AboutRow label="App Version" value="2.1.0" icon="code" />
            <AboutRow label="Data Source" value="National Rail" icon="server" />
            <AboutRow label="Built with" value="React Native" icon="build" />
          </View>
        </View>

        <View style={{ height: 8 }} />
      </ScrollView>
    </View>
  );
}

function SettingToggle({ label, icon, value, onToggle }) {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Ionicons name={icon} size={16} color={COLORS.gray} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <TouchableOpacity
        style={[styles.toggle, { backgroundColor: value ? COLORS.primary : COLORS.gray }]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.toggleButton,
            { transform: [{ translateX: value ? 20 : 2 }] },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
}

function AboutRow({ label, value, icon }) {
  return (
    <View style={styles.aboutItem}>
      <View style={styles.aboutInfo}>
        <Ionicons name={icon} size={16} color={COLORS.gray} />
        <Text style={styles.aboutLabel}>{label}</Text>
      </View>
      <Text style={styles.aboutValue}>{value}</Text>
    </View>
  );
}