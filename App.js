import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

/* =========================================================
   Shared constants & styles
========================================================= */
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

/* =========================================================
   Screen components (file scope to avoid remounts)
========================================================= */

const TrackerScreen = ({ selectedRoute, pulseAnim }) => {
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
    { name: 'Bristol Temple Meads', status: 'upcoming' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
              <View key={station.name} style={styles.stationRow}>
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

const RoutesScreen = ({
  routes,
  onSelectRoute,
  getDelayStyle,
  getDelayText,
}) => (
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
          <View
            key={route.id}
            style={[styles.routeCard, { backgroundColor: COLORS.white }]}
          >
            <TouchableOpacity
              style={styles.routeCardContent}
              onPress={() => onSelectRoute(route)}
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

const AddRouteScreen = ({
  searchText,
  setSearchText,
  setSelectedStation,
  ukStations,
  selectedStation,
  getCurrentDepartures,
  addRoute,
  navigateToScreen,
}) => {

  const suggestions = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return [];
    return ukStations
      .filter(st => st.toLowerCase().includes(q))
      .filter(st => st.toLowerCase() !== q) // de-dup: don’t show exact typed value
      .slice(0, 8);
  }, [searchText, ukStations]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
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
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <Text style={styles.inputLabel}>Search Station</Text>
        <TextInput
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
                  setSearchText(station);       // show only in the input
                  setSelectedStation(station);  // state for departures
                }}
              >
                <Text>{station}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Removed the green “Selected: …” box */}

        {selectedStation ? (
          <>
            <Text style={styles.departuresTitle}>Departures from {selectedStation}</Text>
            <View style={styles.trainsList}>
              {getCurrentDepartures().map((train) => (
                <View key={`${train.destination}-${train.time}`} style={styles.trainCard}>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const SettingsScreen = ({ settings, toggleSetting, navigateToScreen }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => navigateToScreen('routes')}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
    </View>

    <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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

          <View className="aboutItem">
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

const BottomNav = ({ currentScreen, navigateToScreen }) => (
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
        <View style={[styles.gridDot, { backgroundColor: currentScreen === 'routes' ? COLORS.primary : COLORS.gray }]} />
        <View style={[styles.gridDot, { backgroundColor: currentScreen === 'routes' ? COLORS.primary : COLORS.gray }]} />
        <View style={[styles.gridDot, { backgroundColor: currentScreen === 'routes' ? COLORS.primary : COLORS.gray }]} />
        <View style={[styles.gridDot, { backgroundColor: currentScreen === 'routes' ? COLORS.primary : COLORS.gray }]} />
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

/* =========================================================
   Root component
========================================================= */

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

  const [settings, setSettings] = useState({
    pushNotifications: true,
    delayAlerts: true,
    platformChanges: true
  });

  // Station search state
  const [searchText, setSearchText] = useState('');
  const [selectedStation, setSelectedStation] = useState('');

  // UK Train Stations mock data
  const [ukStations] = useState([
    'London Paddington', 'London King\'s Cross', 'London Euston', 'London Victoria',
    'London Liverpool Street', 'London Waterloo', 'London Bridge', 'London St Pancras',
    'Manchester Piccadilly', 'Manchester Victoria', 'Birmingham New Street', 'Birmingham Snow Hill',
    'Leeds', 'Sheffield', 'York', 'Newcastle', 'Edinburgh Waverley', 'Glasgow Central',
    'Glasgow Queen Street', 'Cardiff Central', 'Swansea', 'Bristol Temple Meads', 'Bath Spa',
    'Reading', 'Oxford', 'Cambridge', 'Brighton', 'Canterbury East', 'Dover Priory',
    'Ashford International', 'Liverpool Lime Street', 'Preston', 'Lancaster', 'Carlisle',
    'Inverness', 'Aberdeen', 'Dundee', 'Stirling', 'Perth', 'Exeter St Davids', 'Plymouth',
    'Penzance', 'Truro', 'St Austell', 'Bodmin Parkway', 'Liskeard', 'Looe', 'Falmouth Docks',
    'Gloucester', 'Cheltenham Spa', 'Worcester Foregate Street', 'Hereford', 'Shrewsbury',
    'Chester', 'Wrexham General', 'Bangor', 'Holyhead', 'Aberystwyth', 'Machynlleth',
    'Pwllheli', 'Barmouth', 'Porthmadog', 'Blaenau Ffestiniog', 'Llandudno', 'Rhyl',
    'Prestatyn', 'Flint', 'Shotton', 'Hawarden Bridge', 'Buckley', 'Mold', 'Ruthin',
    'Denbigh', 'St Asaph', 'Abergele & Pensarn', 'Colwyn Bay', 'Old Colwyn', 'Llanfairfechan',
    'Penmaenmawr', 'Llanfairpwll', 'Bodorgan', 'Ty Croes', 'Rhosneigr', 'Valley',
    'Nottingham', 'Derby', 'Leicester', 'Coventry', 'Warwick', 'Leamington Spa',
    'Stratford-upon-Avon', 'Evesham', 'Pershore', 'Worcester Shrub Hill', 'Great Malvern',
    'Ledbury', 'Hereford', 'Abergavenny', 'Pontypool & New Inn', 'Cwmbran', 'Newport',
    'Cardiff Queen Street', 'Pontypridd', 'Treherbert', 'Treorchy', 'Ton Pentre',
    'Ystrad Rhondda', 'Llwynypia', 'Tonypandy', 'Dinas Rhondda', 'Porth', 'Trehafod',
    'Merthyr Tydfil', 'Pentrebach', 'Troedyrhiw', 'Merthyr Vale', 'Quakers Yard',
    'Abercynon', 'Pontypridd', 'Treforest', 'Treforest Estate', 'Taffs Well', 'Radyr',
    'Danescourt', 'Fairwater', 'Waun-gron Park', 'Ninian Park', 'Llandaf', 'Birchgrove',
    'Ty Glas', 'Heath High Level', 'Heath Low Level', 'Rhiwbina', 'Whitchurch',
    'Coryton', 'Cefn Onn', 'Lisvane & Thornhill', 'Caerphilly', 'Aber', 'Energlyn & Churchill Park',
    'Llanbradach', 'Ystrad Mynach', 'Hengoed', 'Pengam', 'Gilfach Fargoed', 'Bargoed',
    'Brithdir', 'Tirphil', 'New Tredegar', 'Ebbw Vale Town', 'Ebbw Vale Parkway',
    'Rogerstone', 'Pye Corner', 'Risca & Pontymister', 'Crosskeys', 'Newbridge',
    'Llanhilleth', 'Crumlin', 'Abertillery', 'Nantyglo', 'Brynmawr', 'Abergavenny'
  ]);

  const [stationDepartures] = useState({
    'London Paddington': [
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
    ],
    'Manchester Piccadilly': [
      { destination: 'London Euston', time: '14:30', platform: '12', duration: '2h 8m' },
      { destination: 'Birmingham New Street', time: '14:45', platform: '3', duration: '1h 35m' },
      { destination: 'Leeds', time: '15:00', platform: '4', duration: '1h 5m' },
      { destination: 'Sheffield', time: '15:15', platform: '5', duration: '55m' },
      { destination: 'Liverpool Lime Street', time: '15:30', platform: '1', duration: '45m' },
      { destination: 'Preston', time: '15:45', platform: '2', duration: '35m' },
      { destination: 'Glasgow Central', time: '16:00', platform: '11', duration: '3h 25m' },
      { destination: 'Edinburgh Waverley', time: '16:15', platform: '10', duration: '3h 15m' }
    ],
    'Birmingham New Street': [
      { destination: 'London Euston', time: '14:30', platform: '7', duration: '1h 25m' },
      { destination: 'Manchester Piccadilly', time: '14:45', platform: '3', duration: '1h 35m' },
      { destination: 'Leeds', time: '15:00', platform: '8', duration: '2h 15m' },
      { destination: 'Wolverhampton', time: '15:15', platform: '2', duration: '20m' },
      { destination: 'Coventry', time: '15:30', platform: '4', duration: '25m' },
      { destination: 'Nottingham', time: '15:45', platform: '6', duration: '1h 10m' },
      { destination: 'Derby', time: '16:00', platform: '5', duration: '45m' },
      { destination: 'Leicester', time: '16:15', platform: '9', duration: '55m' }
    ],
    'London King\'s Cross': [
      { destination: 'Edinburgh Waverley', time: '14:30', platform: '4', duration: '4h 20m' },
      { destination: 'York', time: '14:45', platform: '5', duration: '1h 55m' },
      { destination: 'Leeds', time: '15:00', platform: '6', duration: '2h 15m' },
      { destination: 'Newcastle', time: '15:15', platform: '7', duration: '2h 50m' },
      { destination: 'Cambridge', time: '15:30', platform: '2', duration: '50m' },
      { destination: 'Peterborough', time: '15:45', platform: '3', duration: '45m' },
      { destination: 'Hull', time: '16:00', platform: '8', duration: '2h 40m' },
      { destination: 'Glasgow Central', time: '16:15', platform: '9', duration: '4h 30m' }
    ]
  });

  useEffect(() => {
    if (routes.length > 0) setSelectedRoute(routes[0]);

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleHapticFeedback = (type = 'light') => {
    switch (type) {
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

    const newRoute = {
      id: Date.now(),
      from: selectedStation,
      fromCode: selectedStation.split(' ')[0].substring(0, 3).toUpperCase(),
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

    setRoutes(prev => [newRoute, ...prev]);
    setCurrentScreen('routes');
  };

  const getCurrentDepartures = () => {
    if (!selectedStation) return [];
    return stationDepartures[selectedStation] || [
      { destination: 'London Paddington', time: '15:00', platform: '1', duration: '2h 30m' },
      { destination: 'Birmingham New Street', time: '15:30', platform: '2', duration: '1h 45m' },
      { destination: 'Manchester Piccadilly', time: '16:00', platform: '3', duration: '2h 15m' },
      { destination: 'Leeds', time: '16:30', platform: '4', duration: '3h 00m' }
    ];
  };

  const navigateToScreen = (screen) => {
    handleHapticFeedback('light');
    setCurrentScreen(screen);
  };

  const toggleSetting = (key) => {
    handleHapticFeedback('light');
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const onSelectRoute = (route) => {
    handleHapticFeedback('medium');
    setSelectedRoute(route);
    setCurrentScreen('tracker');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} translucent={false} />
      <View style={styles.statusBarPadding} />

      {currentScreen === 'tracker' && (
        <TrackerScreen selectedRoute={selectedRoute} pulseAnim={pulseAnim} />
      )}

      {currentScreen === 'routes' && (
        <RoutesScreen
          routes={routes}
          onSelectRoute={onSelectRoute}
          getDelayStyle={getDelayStyle}
          getDelayText={getDelayText}
        />
      )}

      {currentScreen === 'add' && (
        <AddRouteScreen
          searchText={searchText}
          setSearchText={setSearchText}
          setSelectedStation={setSelectedStation}
          selectedStation={selectedStation}
          ukStations={ukStations}
          getCurrentDepartures={getCurrentDepartures}
          addRoute={addRoute}
          navigateToScreen={navigateToScreen}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          settings={settings}
          toggleSetting={toggleSetting}
          navigateToScreen={navigateToScreen}
        />
      )}

      <BottomNav currentScreen={currentScreen} navigateToScreen={navigateToScreen} />
    </SafeAreaView>
  );
}

/* =========================================================
   Styles
========================================================= */

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
    padding: 16,
    paddingBottom: 0,
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
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  departuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 8,
    marginBottom: 12,
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
  /* --- tightened spacing for suggestions --- */
  simpleSearchInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  simpleList: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 4,
    marginBottom: 8,     // tighter
  },
  simpleListItem: {
    paddingVertical: 10,  // tighter
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
});