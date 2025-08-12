// theme.js
import { StyleSheet, StatusBar } from 'react-native';

export const COLORS = {
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

export const styles = StyleSheet.create({
    // app layout
    safeArea: { flex: 1, backgroundColor: COLORS.lightGray },
    statusBarPadding: { height: StatusBar.currentHeight || 0, backgroundColor: COLORS.primary },
    container: { flex: 1, backgroundColor: COLORS.lightGray, paddingBottom: 80 },

    // headers
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
    headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerIcon: {
        width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.white,
        alignItems: 'center', justifyContent: 'center',
    },
    headerIconGrid: {
        width: 32, height: 32, flexDirection: 'row', flexWrap: 'wrap',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6, gap: 2, padding: 4,
    },
    gridDot: { width: 6, height: 6, borderRadius: 2, backgroundColor: COLORS.white },
    headerTitle: { fontSize: 20, fontWeight: '600', color: COLORS.white },

    // common content blocks
    content: { padding: 16, paddingBottom: 0 },
    cardContainer: { paddingHorizontal: 16, marginBottom: 16 },

    // tracker screen (slightly compacted)
    journeyCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 18, // was 24
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
        marginBottom: 12, // was 20
    },
    stationInfo: { alignItems: 'center' },
    stationName: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
    stationCode: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    journeyTimes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    scheduledTime: { fontSize: 16, color: 'rgba(255,255,255,0.7)', textDecorationLine: 'line-through' },
    actualTime: { fontSize: 36, fontWeight: 'bold', color: COLORS.white },
    delayBadge: {
        paddingHorizontal: 10, // was 12
        paddingVertical: 4,    // was 6
        borderRadius: 16,
    },
    delayText: { fontSize: 12, fontWeight: '600', color: COLORS.white },

    progressCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 18, // was 24
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
        marginBottom: 14, // was 24
    },
    progressTitle: { fontSize: 20, fontWeight: '600', color: COLORS.black },
    timeRemaining: { alignItems: 'center' },
    timeNumber: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
    timeLabel: { fontSize: 14, color: COLORS.gray },
    stationsContainer: { gap: 10 }, // was 16
    stationRow: { flexDirection: 'row', alignItems: 'center' },
    // Align the dot with text baseline by keeping the container small
    stationIndicatorContainer: {
        width: 24,
        height: 24,                // fixed box just for the dot
        alignItems: 'center',
        justifyContent: 'center',  // center the dot vertically
        marginRight: 16,
        position: 'relative',      // needed for the absolute line
    },
    stationIndicator: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },// Draw the connector line starting at the bottom of the dot
    // (16px dot inside a 24px container => 20px is the dot bottom)
    stationLine: {
        position: 'absolute',
        top: 20,       // start right below the dot
        width: 2,
        height: 32,    // length down to next row's center (tweak if you change row gap)
    },
    // Ensure text vertical metrics are consistent with the 24px dot box
    stationNameText: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,  // centers text nicely against the 24px indicator column
    },

    // routes screen
    routesList: { gap: 12 },
    routeCard: {
        borderRadius: 16, marginBottom: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
    },
    routeCardContent: {
        backgroundColor: 'transparent', padding: 16, borderRadius: 16,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    },
    routeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    routeInfo: { flex: 1 },
    routeFrom: { fontSize: 16, fontWeight: '600', color: COLORS.black, marginBottom: 4 },
    routeDetails: { fontSize: 14, color: COLORS.gray },
    routeDelayBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    routeDelayText: { fontSize: 11, fontWeight: '600' },

    // add screen: search + suggestions
    inputLabel: { fontSize: 16, fontWeight: '600', color: COLORS.black, marginBottom: 12 },
    simpleSearchInput: {
        backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#e5e7eb',
        borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 12,
    },
    simpleList: {
        backgroundColor: COLORS.white, borderRadius: 8, borderWidth: 1,
        borderColor: '#e5e7eb', marginTop: 4, marginBottom: 8,
    },
    simpleListItem: {
        paddingVertical: 10, paddingHorizontal: 12,
        borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
    },

    // departures list
    departuresTitle: { fontSize: 20, fontWeight: '600', color: COLORS.black, marginTop: 8, marginBottom: 12 },
    trainsList: { gap: 12 },
    trainCard: {
        backgroundColor: COLORS.white, borderRadius: 16, padding: 16,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
    },
    trainInfo: { flex: 1 },
    trainHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
    trainDestination: { fontSize: 16, fontWeight: '600', color: COLORS.black },
    trainDetails: { fontSize: 14, color: COLORS.gray },
    addButton: {
        backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 10,
        borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6,
        shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
    },
    addButtonText: { fontSize: 14, fontWeight: '600', color: COLORS.white },

    // settings
    settingsCard: {
        backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    settingsCardTitle: { fontSize: 18, fontWeight: '600', color: COLORS.black },
    settingsList: { gap: 16 },
    settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    settingInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    settingLabel: { fontSize: 16, color: COLORS.black },
    toggle: { width: 44, height: 24, borderRadius: 12, padding: 2, justifyContent: 'center' },
    toggleButton: {
        width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.white,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2,
    },
    aboutList: { gap: 16 },
    aboutItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    aboutInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    aboutLabel: { fontSize: 16, color: COLORS.black },
    aboutValue: { fontSize: 16, color: COLORS.gray, fontWeight: '500' },

    // bottom nav
    bottomNav: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: '#e5e7eb',
        flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05, shadowRadius: 3, elevation: 5,
    },
    navItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
    navText: { fontSize: 12, marginTop: 4 },
    routesIcon: { width: 24, height: 24, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 2 },

    // misc
    errorText: { fontSize: 16, color: COLORS.gray, textAlign: 'center', marginTop: 50 },
});