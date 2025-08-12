// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Animated, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import TrackerScreen from './screens/TrackerScreen';
import RoutesScreen from './screens/RoutesScreen';
import AddRouteScreen from './screens/AddRouteScreen';

import { styles, COLORS } from './theme';

export default function UKTrainTracker() {
  const [currentScreen, setCurrentScreen] = useState('tracker');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [pulseAnim] = useState(new Animated.Value(1));

  const [routes, setRoutes] = useState([
    { id: 1, from: 'London Paddington', fromCode: 'PAD', to: 'Bristol Temple Meads', toCode: 'BTM', scheduledTime: '14:30', actualTime: '14:42', delay: 12, status: 'delayed' },
    { id: 2, from: 'Manchester Piccadilly', to: 'London Euston', scheduledTime: '15:15', actualTime: '15:15', delay: 0, status: 'onTime' },
    { id: 3, from: 'Edinburgh Waverley', to: 'Glasgow Central', scheduledTime: '16:00', actualTime: '16:25', delay: 25, status: 'delayed' },
    { id: 4, from: 'Birmingham New Street', to: 'London Euston', scheduledTime: '17:45', actualTime: '17:45', delay: 0, status: 'onTime' },
  ]);

  const [settings, setSettings] = useState({ pushNotifications: true, delayAlerts: true, platformChanges: true });
  const [searchText, setSearchText] = useState('');
  const [selectedStation, setSelectedStation] = useState('');

  const [ukStations] = useState([
    "London Paddington","London King's Cross","London Euston","London Victoria","London Liverpool Street","London Waterloo","London Bridge","London St Pancras",
    "Manchester Piccadilly","Manchester Victoria","Birmingham New Street","Birmingham Snow Hill","Leeds","Sheffield","York","Newcastle",
    "Edinburgh Waverley","Glasgow Central","Glasgow Queen Street","Cardiff Central","Swansea","Bristol Temple Meads","Bath Spa","Reading","Oxford","Cambridge",
    "Brighton","Canterbury East","Dover Priory","Ashford International","Liverpool Lime Street","Preston","Lancaster","Carlisle","Inverness","Aberdeen",
    "Dundee","Stirling","Perth","Exeter St Davids","Plymouth","Penzance","Truro","St Austell","Bodmin Parkway","Liskeard","Looe","Falmouth Docks",
    "Gloucester","Cheltenham Spa","Worcester Foregate Street","Hereford","Shrewsbury","Chester","Wrexham General","Bangor","Holyhead","Aberystwyth",
    "Machynlleth","Pwllheli","Barmouth","Porthmadog","Blaenau Ffestiniog","Llandudno","Rhyl","Prestatyn","Flint","Shotton","Hawarden Bridge","Buckley",
    "Mold","Ruthin","Denbigh","St Asaph","Abergele & Pensarn","Colwyn Bay","Old Colwyn","Llanfairfechan","Penmaenmawr","Llanfairpwll","Bodorgan","Ty Croes",
    "Rhosneigr","Valley","Nottingham","Derby","Leicester","Coventry","Warwick","Leamington Spa","Stratford-upon-Avon","Evesham","Pershore",
    "Worcester Shrub Hill","Great Malvern","Ledbury","Hereford","Abergavenny","Pontypool & New Inn","Cwmbran","Newport","Cardiff Queen Street","Pontypridd",
    "Treherbert","Treorchy","Ton Pentre","Ystrad Rhondda","Llwynypia","Tonypandy","Dinas Rhondda","Porth","Trehafod","Merthyr Tydfil","Pentrebach",
    "Troedyrhiw","Merthyr Vale","Quakers Yard","Abercynon","Pontypridd","Treforest","Treforest Estate","Taffs Well","Radyr","Danescourt","Fairwater",
    "Waun-gron Park","Ninian Park","Llandaf","Birchgrove","Ty Glas","Heath High Level","Heath Low Level","Rhiwbina","Whitchurch","Coryton","Cefn Onn",
    "Lisvane & Thornhill","Caerphilly","Aber","Energlyn & Churchill Park","Llanbradach","Ystrad Mynach","Hengoed","Pengam","Gilfach Fargoed","Bargoed",
    "Brithdir","Tirphil","New Tredegar","Ebbw Vale Town","Ebbw Vale Parkway","Rogerstone","Pye Corner","Risca & Pontymister","Crosskeys","Newbridge",
    "Llanhilleth","Crumlin","Abertillery","Nantyglo","Brynmawr","Abergavenny"
  ]);

  const [stationDepartures] = useState({
    "London Paddington": [
      { destination: "Bristol Temple Meads", time: "14:30", platform: "5", duration: "1h 45m" },
      { destination: "Reading", time: "14:45", platform: "2", duration: "22m" },
      { destination: "Cardiff Central", time: "15:00", platform: "7", duration: "2h 15m" },
      { destination: "Bath Spa", time: "15:15", platform: "4", duration: "1h 28m" },
      { destination: "Oxford", time: "15:30", platform: "3", duration: "1h 2m" },
      { destination: "Swindon", time: "15:45", platform: "1", duration: "55m" },
      { destination: "Newport", time: "16:00", platform: "6", duration: "1h 52m" },
      { destination: "Gloucester", time: "16:15", platform: "8", duration: "1h 38m" },
      { destination: "Exeter St Davids", time: "16:30", platform: "9", duration: "2h 35m" },
      { destination: "Plymouth", time: "16:45", platform: "10", duration: "3h 22m" },
      { destination: "Cheltenham Spa", time: "17:00", platform: "3", duration: "1h 55m" },
      { destination: "Worcester Foregate Street", time: "17:15", platform: "2", duration: "1h 42m" },
      { destination: "Birmingham New Street", time: "17:30", platform: "4", duration: "1h 28m" },
      { destination: "Hereford", time: "17:45", platform: "7", duration: "2h 18m" },
      { destination: "Swansea", time: "18:00", platform: "11", duration: "2h 45m" },
      { destination: "Penzance", time: "18:15", platform: "12", duration: "4h 35m" },
      { destination: "Taunton", time: "18:30", platform: "5", duration: "1h 58m" },
      { destination: "Bridgwater", time: "18:45", platform: "6", duration: "2h 12m" }
    ],
    "Manchester Piccadilly": [
      { destination: "London Euston", time: "14:30", platform: "12", duration: "2h 8m" },
      { destination: "Birmingham New Street", time: "14:45", platform: "3", duration: "1h 35m" },
      { destination: "Leeds", time: "15:00", platform: "4", duration: "1h 5m" },
      { destination: "Sheffield", time: "15:15", platform: "5", duration: "55m" },
      { destination: "Liverpool Lime Street", time: "15:30", platform: "1", duration: "45m" },
      { destination: "Preston", time: "15:45", platform: "2", duration: "35m" },
      { destination: "Glasgow Central", time: "16:00", platform: "11", duration: "3h 25m" },
      { destination: "Edinburgh Waverley", time: "16:15", platform: "10", duration: "3h 15m" }
    ],
    "Birmingham New Street": [
      { destination: "London Euston", time: "14:30", platform: "7", duration: "1h 25m" },
      { destination: "Manchester Piccadilly", time: "14:45", platform: "3", duration: "1h 35m" },
      { destination: "Leeds", time: "15:00", platform: "8", duration: "2h 15m" },
      { destination: "Wolverhampton", time: "15:15", platform: "2", duration: "20m" },
      { destination: "Coventry", time: "15:30", platform: "4", duration: "25m" },
      { destination: "Nottingham", time: "15:45", platform: "6", duration: "1h 10m" },
      { destination: "Derby", time: "16:00", platform: "5", duration: "45m" },
      { destination: "Leicester", time: "16:15", platform: "9", duration: "55m" }
    ],
    "London King's Cross": [
      { destination: "Edinburgh Waverley", time: "14:30", platform: "4", duration: "4h 20m" },
      { destination: "York", time: "14:45", platform: "5", duration: "1h 55m" },
      { destination: "Leeds", time: "15:00", platform: "6", duration: "2h 15m" },
      { destination: "Newcastle", time: "15:15", platform: "7", duration: "2h 50m" },
      { destination: "Cambridge", time: "15:30", platform: "2", duration: "50m" },
      { destination: "Peterborough", time: "15:45", platform: "3", duration: "45m" },
      { destination: "Hull", time: "16:00", platform: "8", duration: "2h 40m" },
      { destination: "Glasgow Central", time: "16:15", platform: "9", duration: "4h 30m" }
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
    if (type === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    else if (type === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    else Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const getDelayStyle = (delay) => {
    if (delay === 0) return { backgroundColor: COLORS.greenLight, color: COLORS.green };
    if (delay <= 15) return { backgroundColor: COLORS.orangeLight, color: COLORS.orange };
    return { backgroundColor: COLORS.redLight, color: COLORS.red };
  };
  const getDelayText = (delay, status) => (status === 'onTime' ? 'ON TIME' : `${delay} MIN DELAY`);

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
      status: Math.random() > 0.6 ? 'delayed' : 'onTime',
    };
    if (newRoute.delay > 0) {
      const [h, m] = newRoute.scheduledTime.split(':');
      const total = parseInt(h) * 60 + parseInt(m) + newRoute.delay;
      newRoute.actualTime = `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
    }
    setRoutes(prev => [newRoute, ...prev]);
    setCurrentScreen('routes');
  };

  const getCurrentDepartures = () => (selectedStation ? (stationDepartures[selectedStation] || []) : []);
  const navigateToScreen = (screen) => { handleHapticFeedback('light'); setCurrentScreen(screen); };
  const toggleSetting = (key) => { handleHapticFeedback('light'); setSettings(prev => ({ ...prev, [key]: !prev[key] })); };
  const onSelectRoute = (route) => { handleHapticFeedback('medium'); setSelectedRoute(route); setCurrentScreen('tracker'); };

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
          selectedStation={selectedStation}
          setSelectedStation={setSelectedStation}
          ukStations={ukStations}
          getCurrentDepartures={getCurrentDepartures}
          addRoute={addRoute}
          navigateToScreen={navigateToScreen}
        />
      )}

      {currentScreen === 'settings' && (
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
            <View style={styles.settingsCard}>
              <View style={styles.cardHeader}>
                <Ionicons name="notifications" size={20} color={COLORS.primary} />
                <Text style={styles.settingsCardTitle}>Notifications</Text>
              </View>
              <View style={styles.settingsList}>
                {['pushNotifications','delayAlerts','platformChanges'].map(key => (
                  <View key={key} style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                      <Ionicons name={key==='pushNotifications'?'phone-portrait':key==='delayAlerts'?'time':'swap-horizontal'} size={16} color={COLORS.gray} />
                      <Text style={styles.settingLabel}>
                        {key==='pushNotifications'?'Push Notifications':key==='delayAlerts'?'Delay Alerts':'Platform Changes'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.toggle, { backgroundColor: settings[key] ? COLORS.primary : COLORS.gray }]}
                      onPress={() => toggleSetting(key)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.toggleButton, { transform: [{ translateX: settings[key] ? 20 : 2 }] }]} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

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
      )}

      <BottomNav currentScreen={currentScreen} navigateToScreen={navigateToScreen} />
    </SafeAreaView>
  );
}

const BottomNav = ({ currentScreen, navigateToScreen }) => (
  <View style={styles.bottomNav}>
    {[
      { key: 'tracker', icon: 'train', label: 'Tracker' },
      { key: 'routes', icon: null, label: 'Routes', grid: true },
      { key: 'add', icon: 'add', label: 'Add' },
      { key: 'settings', icon: 'settings', label: 'Settings' },
    ].map(tab => (
      <TouchableOpacity
        key={tab.key}
        style={styles.navItem}
        onPress={() => navigateToScreen(tab.key)}
        activeOpacity={0.7}
      >
        {tab.grid ? (
          <View style={styles.routesIcon}>
            {[0,1,2,3].map(i => (
              <View key={i} style={[styles.gridDot, { backgroundColor: currentScreen === tab.key ? COLORS.primary : COLORS.gray }]} />
            ))}
          </View>
        ) : (
          <Ionicons name={tab.icon} size={24} color={currentScreen === tab.key ? COLORS.primary : COLORS.gray} />
        )}
        <Text style={[styles.navText, {
          color: currentScreen === tab.key ? COLORS.primary : COLORS.gray,
          fontWeight: currentScreen === tab.key ? '600' : '400'
        }]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);