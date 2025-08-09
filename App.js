import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  orange: '#f97316',
  orangeLight: '#fed7aa',
  green: '#10b981',
  greenLight: '#d1fae5',
  red: '#dc2626',
  redLight: '#fecaca',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  white: '#ffffff',
  black: '#000000',
};

export default function UKTrainTracker() {
  const [currentScreen, setCurrentScreen] = useState('tracker');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [pulseAnim] = useState(new Animated.Value(1));
  
  const [routes, setRoutes] = useState([
    {
      id: 1,
      from: 'London Paddington',
      fromCode: 'PAD',
      to: 'Bristol Temple Meads',
      toCode: 'BTM',
      scheduledTime: '14:30',
      actualTime: '14:42',
      delay: 12,
      status: 'delayed'
    },
    {
      id: 2,
      from: 'Manchester Piccadilly',
      to: 'London Euston',
      scheduledTime: '15:15',
      actualTime: '15:15',
      delay: 0,
      status: 'onTime'
    },
    {
      id: 3,
      from: 'Edinburgh Waverley',
      to: 'Glasgow Central',
      scheduledTime: '16:00',
      actualTime: '16:25',
      delay: 25,
      status: 'delayed'
    },
    {
      id: 4,
      from: 'Birmingham New Street',
      to: 'London Euston',
      scheduledTime: '17:45',
      actualTime: '17:45',
      delay: 0,
      status: 'onTime'
    }
  ]);

  const [availableTrains] = useState([
    { destination: 'Bristol Temple Meads', time: '14:30', platform: '5', duration: '1h 45m' },
    { destination: 'Reading', time: '14:45', platform: '2', duration: '22m' },
    { destination: 'Cardiff Central', time: '15:00', platform: '7', duration: '2h 15m' },
    { destination: 'Bath Spa', time: '15:15', platform: '4', duration: '1h 28m' },
    { destination: 'Oxford', time: '15:30', platform: '3', duration: '1h 2m' },
    { destination: 'Swindon', time: '15:45', platform: '1', duration: '55m' },
    { destination: 'Newport', time: '16:00', platform: '6', duration: '1h 52m' },
    { destination: 'Gloucester', time: '16:15', platform: '8', duration: '1h 38m' },
    { destination: 'Exeter St Davids', time: '16:30', platform: '9', duration: '2h 35m' },
    { destination: 'Plymouth', time: '16:45', platform: '10', duration: '3h 22m' },
    { destination: 'Cheltenham Spa', time: '17:00', platform: '3', duration: '1h 55m' },
    { destination: 'Worcester Foregate Street', time: '17:15', platform: '2', duration: '1h 42m' },
    { destination: 'Birmingham New Street', time: '17:30', platform: '4', duration: '1h 28m' },
    { destination: 'Hereford', time: '17:45', platform: '7', duration: '2h 18m' },
    { destination: 'Swansea', time: '18:00', platform: '11', duration: '2h 45m' },
    { destination: 'Penzance', time: '18:15', platform: '12', duration: '4h 35m' },
    { destination: 'Taunton', time: '18:30', platform: '5', duration: '1h 58m' },
    { destination: 'Bridgwater', time: '18:45', platform: '6', duration: '2h 12m' }
  ]);

  const [settings, setSettings] = useState({
    pushNotifications: true,
    delayAlerts: true,
    platformChanges: true
  });

  useEffect(() => {
    if (routes.length > 0) {
      setSelectedRoute(routes[0]);
    }
    
    // Start pulse animation for current station
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleHapticFeedback = (type = 'light') => {
    switch(type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
    }
  };

  const getDelayStyle = (delay) => {
    if (delay === 0) return { backgroundColor: COLORS.greenLight, color: COLORS.green };
    if (delay <= 15) return { backgroundColor: COLORS.orangeLight, color: COLORS.orange };
    return { backgroundColor: COLORS.redLight, color: COLORS.red };
  };

  const getDelayText = (delay, status) => {
    if (status === 'onTime') return 'ON TIME';
    return `${delay} MIN DELAY`;
  };

  const addRoute = (train) => {
    handleHapticFeedback('success');
    
    // Create new route object
    const newRoute = {
      id: Date.now(), // Use timestamp to avoid calculating from routes length
      from: 'London Paddington',
      fromCode: 'PAD',
      to: train.destination,
      toCode: train.destination.split(' ')[0].substring(0, 3).toUpperCase(),
      scheduledTime: train.time,
      actualTime: train.time,
      delay: Math.floor(Math.random() * 20),
      status: Math.random() > 0.6 ? 'delayed' : 'onTime'
    };
    
    if (newRoute.delay > 0) {
      const delayMinutes = newRoute.delay;
      const [hours, minutes] = newRoute.scheduledTime.split(':');
      const totalMinutes = parseInt(hours) * 60 + parseInt(minutes) + delayMinutes;
      const newHours = Math.floor(totalMinutes / 60);
      const newMins = totalMinutes % 60;
      newRoute.actualTime = `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
    }
    
    // Add new route to the top of the list
    setRoutes(prevRoutes => [newRoute, ...prevRoutes]);
    setCurrentScreen('routes');
  };

  const navigateToScreen = (screen) => {
    handleHapticFeedback('light');
    setCurrentScreen(screen);
  };

  const TrackerScreen = () => {
    if (!selectedRoute) return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No route selected</Text>
      </View>
    );

    const stations = [
      { name: 'London Paddington', status: 'completed' },
      { name: 'Slough', status: 'completed' },
      { name: 'Reading', status: 'current' },
      { name: 'Swindon', status: 'upcoming' },
      { name: 'Bath Spa', status: 'upcoming' },
      { name: 'Bristol Temple Meads', status: 'upcoming' }
    ];

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="checkmark" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.headerTitle}>UK Train Tracker</Text>
          </View>
        </View>

        {/* Main Journey Card */}
        <View style={[styles.cardContainer, { marginTop: 8 }]}>
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
              <View style={[styles.delayBadge, { 
                backgroundColor: selectedRoute.delay > 0 ? COLORS.orange : COLORS.green 
              }]}>
                <Text style={styles.delayText}>
                  {selectedRoute.delay > 0 ? `+${selectedRoute.delay} MIN` : 'ON TIME'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Journey Progress */}
        <View style={styles.cardContainer}>
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
                <View key={index} style={styles.stationRow}>
                  <View style={styles.stationIndicatorContainer}>
                    <Animated.View style={[
                      styles.stationIndicator,
                      {
                        backgroundColor: station.status === 'completed' ? COLORS.green : 
                                        station.status === 'current' ? COLORS.orange : COLORS.white,
                        borderColor: station.status === 'completed' ? COLORS.green : 
                                   station.status === 'current' ? COLORS.orange : COLORS.gray,
                        transform: station.status === 'current' ? [{ scale: pulseAnim }] : [{ scale: 1 }]
                      }
                    ]}>
                      {station.status === 'completed' && (
                        <Ionicons name="checkmark" size={10} color={COLORS.white} />
                      )}
                      {station.status === 'current' && (
                        <Ionicons name="train" size={10} color={COLORS.white} />
                      )}
                    </Animated.View>
                    {index < stations.length - 1 && (
                      <View style={[
                        styles.stationLine,
                        { backgroundColor: station.status === 'completed' ? COLORS.green : COLORS.lightGray }
                      ]} />
                    )}
                  </View>
                  
                  <Text style={[
                    styles.stationNameText,
                    {
                      color: station.status === 'current' ? COLORS.orange : 
                             station.status === 'completed' ? COLORS.green : COLORS.gray,
                      fontWeight: station.status === 'current' ? '600' : '500'
                    }
                  ]}>
                    {station.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const RoutesScreen = () => (
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.routesList}>
          {routes.map((route) => (
            <View
              key={route.id}
              style={[styles.routeCard, { backgroundColor: COLORS.white }]}
            >
              <TouchableOpacity
                style={styles.routeCardContent}
                onPress={() => {
                  handleHapticFeedback('medium');
                  setSelectedRoute(route);
                  setCurrentScreen('tracker');
                }}
                activeOpacity={0.8}
              >
                <View style={styles.routeInfo}>
                  <View style={styles.routeHeader}>
                    <Text style={styles.routeFrom}>{route.from}</Text>
                  </View>
                  <Text style={styles.routeDetails}>
                    {route.scheduledTime} → {route.to}
                  </Text>
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

  const AddRouteScreen = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigateToScreen('routes')}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Route</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stationSelector}>
          <Text style={styles.inputLabel}>Departure Station</Text>
          <View style={styles.stationInput}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <Text style={styles.stationInputText}>London Paddington</Text>
          </View>
        </View>

        <Text style={styles.departuresTitle}>Next Departures</Text>
        <View style={styles.trainsList}>
          {availableTrains.map((train, index) => (
            <View key={index} style={styles.trainCard}>
              <View style={styles.trainInfo}>
                <View style={styles.trainHeader}>
                  <Ionicons name="train" size={16} color={COLORS.primary} />
                  <Text style={styles.trainDestination}>{train.destination}</Text>
                </View>
                <Text style={styles.trainDetails}>
                  🕐 {train.time} • 🚉 Platform {train.platform} • ⏱️ {train.duration}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => addRoute(train)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={16} color={COLORS.white} />
                <Text style={styles.addButtonText}>ADD</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const SettingsScreen = () => {
    const toggleSetting = (key) => {
      handleHapticFeedback('light');
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigateToScreen('routes')}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Notifications */}
          <View style={styles.settingsCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="notifications" size={20} color={COLORS.primary} />
              <Text style={styles.settingsCardTitle}>Notifications</Text>
            </View>
            
            <View style={styles.settingsList}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="phone-portrait" size={16} color={COLORS.gray} />
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggle, { backgroundColor: settings.pushNotifications ? COLORS.primary : COLORS.gray }]}
                  onPress={() => toggleSetting('pushNotifications')}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.toggleButton,
                    { transform: [{ translateX: settings.pushNotifications ? 20 : 2 }] }
                  ]} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="time" size={16} color={COLORS.gray} />
                  <Text style={styles.settingLabel}>Delay Alerts</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggle, { backgroundColor: settings.delayAlerts ? COLORS.primary : COLORS.gray }]}
                  onPress={() => toggleSetting('delayAlerts')}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.toggleButton,
                    { transform: [{ translateX: settings.delayAlerts ? 20 : 2 }] }
                  ]} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Ionicons name="swap-horizontal" size={16} color={COLORS.gray} />
                  <Text style={styles.settingLabel}>Platform Changes</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggle, { backgroundColor: settings.platformChanges ? COLORS.primary : COLORS.gray }]}
                  onPress={() => toggleSetting('platformChanges')}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.toggleButton,
                    { transform: [{ translateX: settings.platformChanges ? 20 : 2 }] }
                  ]} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* About */}
          <View style={styles.settingsCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle" size={20} color={COLORS.primary} />
              <Text style={styles.settingsCardTitle}>About</Text>
            </View>
            
            <View style={styles.aboutList}>
              <View style={styles.aboutItem}>
                <View style={styles.aboutInfo}>
                  <Ionicons name="code" size={16} color={COLORS.gray} />
                  <Text style={styles.aboutLabel}>App Version</Text>
                </View>
                <Text style={styles.aboutValue}>2.1.0</Text>
              </View>
              
              <View style={styles.aboutItem}>
                <View style={styles.aboutInfo}>
                  <Ionicons name="server" size={16} color={COLORS.gray} />
                  <Text style={styles.aboutLabel}>Data Source</Text>
                </View>
                <Text style={styles.aboutValue}>National Rail</Text>
              </View>
              
              <View style={styles.aboutItem}>
                <View style={styles.aboutInfo}>
                  <Ionicons name="build" size={16} color={COLORS.gray} />
                  <Text style={styles.aboutLabel}>Built with</Text>
                </View>
                <Text style={styles.aboutValue}>React Native</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const BottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateToScreen('tracker')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="train"
          size={24}
          color={currentScreen === 'tracker' ? COLORS.primary : COLORS.gray}
        />
        <Text style={[styles.navText, { 
          color: currentScreen === 'tracker' ? COLORS.primary : COLORS.gray,
          fontWeight: currentScreen === 'tracker' ? '600' : '400'
        }]}>
          Tracker
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateToScreen('routes')}
        activeOpacity={0.7}
      >
        <View style={styles.routesIcon}>
          <View style={[styles.gridDot, { 
            backgroundColor: currentScreen === 'routes' ? COLORS.primary : COLORS.gray 
          }]} />
          <View style={[styles.gridDot, { 
            backgroundColor: currentScreen === 'routes' ? COLORS.primary : COLORS.gray 
          }]} />
          <View style={[styles.gridDot, { 
            backgroundColor: currentScreen === 'routes' ? COLORS.primary : COLORS.gray 
          }]} />
          <View style={[styles.gridDot, { 
            backgroundColor: currentScreen === 'routes' ? COLORS.primary : COLORS.gray 
          }]} />
        </View>
        <Text style={[styles.navText, { 
          color: currentScreen === 'routes' ? COLORS.primary : COLORS.gray,
          fontWeight: currentScreen === 'routes' ? '600' : '400'
        }]}>
          Routes
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateToScreen('add')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="add"
          size={24}
          color={currentScreen === 'add' ? COLORS.primary : COLORS.gray}
        />
        <Text style={[styles.navText, { 
          color: currentScreen === 'add' ? COLORS.primary : COLORS.gray,
          fontWeight: currentScreen === 'add' ? '600' : '400'
        }]}>
          Add
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateToScreen('settings')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="settings"
          size={24}
          color={currentScreen === 'settings' ? COLORS.primary : COLORS.gray}
        />
        <Text style={[styles.navText, { 
          color: currentScreen === 'settings' ? COLORS.primary : COLORS.gray,
          fontWeight: currentScreen === 'settings' ? '600' : '400'
        }]}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} translucent={false} />
      <View style={styles.statusBarPadding} />
      {currentScreen === 'tracker' && <TrackerScreen />}
      {currentScreen === 'routes' && <RoutesScreen />}
      {currentScreen === 'add' && <AddRouteScreen />}
      {currentScreen === 'settings' && <SettingsScreen />}
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  statusBarPadding: {
    height: StatusBar.currentHeight || 0,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconGrid: {
    width: 32,
    height: 32,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    gap: 2,
    padding: 4,
  },
  gridDot: {
    width: 6,
    height: 6,
    borderRadius: 2,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  journeyCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  journeyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  stationInfo: {
    alignItems: 'center',
  },
  stationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  stationCode: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  journeyTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduledTime: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textDecorationLine: 'line-through',
  },
  actualTime: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  delayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  delayText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
  },
  timeRemaining: {
    alignItems: 'center',
  },
  timeNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  timeLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  stationsContainer: {
    gap: 16,
  },
  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationIndicatorContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  stationIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationLine: {
    width: 2,
    height: 32,
    marginTop: 4,
  },
  stationNameText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  routesList: {
    gap: 12,
  },
  routeCard: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  routeCardContent: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  newBadge: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  routeInfo: {
    flex: 1,
  },
  routeFrom: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  routeDetails: {
    fontSize: 14,
    color: COLORS.gray,
  },
  routeDelayBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  routeDelayText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stationSelector: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  stationInput: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stationInputText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  departuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 16,
  },
  trainsList: {
    gap: 12,
  },
  trainCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  trainInfo: {
    flex: 1,
  },
  trainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  trainDestination: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  trainDetails: {
    fontSize: 14,
    color: COLORS.gray,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  settingsCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  settingsList: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.black,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  aboutList: {
    gap: 16,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aboutLabel: {
    fontSize: 16,
    color: COLORS.black,
  },
  aboutValue: {
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: '500',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
  routesIcon: {
    width: 24,
    height: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 50,
  },
});