import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useReports } from '../context/ReportContext';
import { useEffect as useReactEffect, useState as useReactState } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

// Full list of water sites
const additionalSites = [
  { name: "Potomac River at Point of Rocks", coords: [39.2776, -77.5433], status: "safe" },
  { name: "Rappahannock River at Fredericksburg", coords: [38.3032, -77.4605], status: "caution" },
  { name: "James River at Lynchburg", coords: [37.4138, -79.1422], status: "unsafe" },
  { name: "York River at West Point", coords: [37.5318, -76.8044], status: "warning" },
  { name: "Shenandoah River at Front Royal", coords: [38.9184, -78.1928], status: "safe" },
  { name: "Occoquan Reservoir", coords: [38.6820, -77.3486], status: "caution" },
  { name: "Lake Anna", coords: [38.0002, -77.8000], status: "warning" },
  { name: "Smith Mountain Lake", coords: [37.0715, -79.6170], status: "safe" },
  { name: "Philpott Lake", coords: [36.7660, -80.0270], status: "safe" },
  { name: "Lake Drummond (Great Dismal Swamp)", coords: [36.6114, -76.4933], status: "unsafe" },
  { name: "Chickahominy River near Providence Forge", coords: [37.4446, -77.0400], status: "warning" },
  { name: "Appomattox River at Farmville", coords: [37.3021, -78.3919], status: "caution" },
  { name: "Dan River at South Boston", coords: [36.6982, -78.9014], status: "safe" },
  { name: "New River at Radford", coords: [37.1360, -80.5720], status: "safe" },
  { name: "Claytor Lake", coords: [37.0630, -80.6240], status: "caution" },
  { name: "Maury River at Lexington", coords: [37.7832, -79.4425], status: "safe" },
  { name: "Mattaponi River at Aylett", coords: [37.8079, -77.1314], status: "warning" },
  { name: "Meherrin River at Emporia", coords: [36.6949, -77.5425], status: "caution" },
  { name: "Back Bay (Virginia Beach)", coords: [36.6468, -75.9505], status: "unsafe" },
  { name: "Lake Moomaw", coords: [37.9460, -79.9550], status: "safe" },
  { name: "South Fork Shenandoah at Luray", coords: [38.6657, -78.4597], status: "safe" },
  { name: "North Fork Shenandoah at Strasburg", coords: [38.9887, -78.3583], status: "caution" },
  { name: "Rivanna River at Charlottesville", coords: [38.0293, -78.4767], status: "warning" },
  { name: "Jackson River at Covington", coords: [37.7932, -79.9939], status: "safe" },
  { name: "Cowpasture River at Williamsville", coords: [38.1390, -79.5690], status: "safe" },
  { name: "Craig Creek at Eagle Rock", coords: [37.6426, -79.7970], status: "caution" },
  { name: "Roanoke River at Roanoke", coords: [37.2710, -79.9414], status: "warning" },
  { name: "Roanoke River at Weldon", coords: [36.4300, -77.5950], status: "unsafe" },
  { name: "Big Otter River at Bedford", coords: [37.3349, -79.5237], status: "safe" },
  { name: "Falling River at Brookneal", coords: [37.0540, -78.9510], status: "caution" },
  { name: "Staunton River at Altavista", coords: [37.1110, -79.2900], status: "safe" },
  { name: "Staunton River at Randolph", coords: [36.9180, -78.7430], status: "warning" },
  { name: "Blackwater River at Franklin", coords: [36.6785, -76.9220], status: "caution" },
  { name: "Nottoway River at Stony Creek", coords: [36.9485, -77.3975], status: "safe" },
  { name: "Nottoway River at Sebrell", coords: [36.8260, -77.2150], status: "warning" },
  { name: "Appomattox River at Petersburg", coords: [37.2279, -77.4019], status: "unsafe" },
  { name: "Lake Gaston (VA side)", coords: [36.5668, -77.8850], status: "safe" },
  { name: "Kerr Reservoir (Buggs Island Lake)", coords: [36.6012, -78.5265], status: "caution" },
  { name: "Leesville Lake", coords: [37.0200, -79.3650], status: "warning" },
  { name: "John H. Kerr Dam Tailwater", coords: [36.5920, -78.2770], status: "safe" },
  { name: "Lake Chesdin", coords: [37.1850, -77.6420], status: "caution" },
  { name: "Lake Accotink", coords: [38.8006, -77.2408], status: "warning" },
  { name: "Lake Fairfax", coords: [38.9510, -77.3078], status: "safe" },
  { name: "Burke Lake", coords: [38.7600, -77.3040], status: "caution" },
  { name: "Lake Barcroft", coords: [38.8450, -77.1420], status: "warning" },
  { name: "Hunting Run Reservoir", coords: [38.2630, -77.5750], status: "safe" },
  { name: "Motts Run Reservoir", coords: [38.3200, -77.5800], status: "caution" },
  { name: "Swift Creek Reservoir", coords: [37.4180, -77.6480], status: "warning" },
  { name: "Beaverdam Reservoir (Ashburn)", coords: [39.0380, -77.5400], status: "safe" },
  { name: "Lake Frederick", coords: [39.0470, -78.1440], status: "caution" },
  { name: "Lake Arrowhead (Luray)", coords: [38.6430, -78.4640], status: "warning" },
  { name: "Mountain Run Lake", coords: [38.5000, -77.9900], status: "safe" },
  { name: "Lake Brittle", coords: [38.6190, -77.7400], status: "caution" },
  { name: "Douthat Lake", coords: [37.9060, -79.7980], status: "safe" },
  { name: "Sherando Lake", coords: [37.9300, -79.0030], status: "caution" },
  { name: "Harrison Lake", coords: [37.3100, -77.1800], status: "warning" },
  { name: "Diascund Reservoir", coords: [37.3220, -76.8600], status: "safe" },
  { name: "Little Creek Reservoir", coords: [37.3040, -76.7910], status: "caution" },
  { name: "Chesapeake Bay at Hampton", coords: [37.0299, -76.3452], status: "warning" },
  { name: "Chesapeake Bay at Norfolk", coords: [36.8508, -76.2859], status: "unsafe" },
  { name: "Chesapeake Bay at Tangier Island", coords: [37.8250, -75.9910], status: "safe" },
  { name: "Elizabeth River at Portsmouth", coords: [36.8354, -76.2983], status: "warning" },
  { name: "Nansemond River at Suffolk", coords: [36.7280, -76.5800], status: "caution" },
  { name: "Lynnhaven River at Virginia Beach", coords: [36.8850, -76.0500], status: "unsafe" },
  { name: "James River at Jamestown", coords: [37.2100, -76.7800], status: "caution" },
  { name: "James River at Richmond", coords: [37.5407, -77.4360], status: "warning" },
  { name: "James River at Scottsville", coords: [37.7980, -78.4980], status: "safe" },
  { name: "James River at Buchanan", coords: [37.5270, -79.6830], status: "caution" },
  { name: "Holston River (VA section)", coords: [36.6540, -81.7500], status: "safe" },
  { name: "Clinch River at Cleveland", coords: [36.9400, -82.1500], status: "caution" },
  { name: "Clinch River at Clinchport", coords: [36.6800, -82.7460], status: "warning" },
  { name: "Powell River at Big Stone Gap", coords: [36.8660, -82.7800], status: "safe" },
  { name: "Powell River at Pennington Gap", coords: [36.7570, -83.0290], status: "caution" },
  { name: "Russell Fork at Haysi", coords: [37.2090, -82.2940], status: "warning" },
  { name: "Pound River at Pound", coords: [37.1230, -82.6010], status: "safe" },
  { name: "Guest River at Coeburn", coords: [36.9440, -82.4640], status: "caution" },
  { name: "North Fork Holston at Saltville", coords: [36.8830, -81.7630], status: "safe" },
  { name: "North Fork Holston at Gate City", coords: [36.6340, -82.5800], status: "warning" },
  { name: "South Fork Holston at Damascus", coords: [36.6350, -81.7830], status: "safe" },
  { name: "South Fork Holston at Abingdon", coords: [36.7090, -81.9700], status: "caution" },
  { name: "Laurel Bed Lake", coords: [36.8500, -82.1900], status: "safe" },
  { name: "Hidden Valley Lake", coords: [36.8700, -82.1600], status: "caution" },
  { name: "Hungry Mother Lake", coords: [36.8830, -81.5330], status: "safe" },
  { name: "South Holston Lake (VA section)", coords: [36.5320, -82.1000], status: "warning" },
  { name: "Lake Robertson", coords: [37.8100, -79.5500], status: "caution" },
  { name: "Wilborn Lake", coords: [37.5100, -78.8300], status: "safe" },
  { name: "Lake Prince", coords: [36.8100, -76.7500], status: "warning" },
  { name: "Lake Kilby", coords: [36.8150, -76.7650], status: "safe" },
  { name: "Western Branch Reservoir", coords: [36.8300, -76.7400], status: "caution" },
  { name: "Stumpy Lake", coords: [36.7900, -76.1400], status: "warning" },
  { name: "Lake Whitehurst", coords: [36.8800, -76.2100], status: "safe" },
  { name: "Lake Taylor", coords: [36.8600, -76.2000], status: "caution" },
  { name: "Lake Lawson", coords: [36.8900, -76.1700], status: "warning" },
  { name: "Lake Smith", coords: [36.9000, -76.1800], status: "safe" },
  { name: "Indian Creek Reservoir", coords: [36.8300, -77.2600], status: "caution" },
  { name: "Lee Lake", coords: [37.2300, -77.4000], status: "warning" },
  { name: "Curtis Lake", coords: [38.4200, -77.5500], status: "safe" },
  { name: "Lake Manassas", coords: [38.7800, -77.6600], status: "caution" },
  { name: "Lake Arrowhead (Stafford)", coords: [38.3900, -77.4900], status: "warning" },
  { name: "Silver Lake (Haymarket)", coords: [38.8800, -77.6700], status: "safe" }
];

const defaultDescription = "No description available.";

const statusColors = {
  safe: '#27ae60',
  caution: '#f39c12',
  warning: '#e74c3c',
  unsafe: '#8e44ad'
};

const statusIcons = {
  safe: 'fas fa-check-circle',
  caution: 'fas fa-exclamation-triangle',
  warning: 'fas fa-exclamation-circle',
  unsafe: 'fas fa-times-circle'
};

const WaterMap = () => {
  const { reports } = useReports();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [search, setSearch] = useState("");
  const [filteredSites, setFilteredSites] = useState(additionalSites);
  const [verifiedLocations, setVerifiedLocations] = useReactState([]);

  // Fetch verified locations from Firestore
  useReactEffect(() => {
    const unsub = onSnapshot(collection(db, 'verifiedLocations'), (snapshot) => {
      setVerifiedLocations(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsub();
  }, []);

  // Filter reports to last 24 hours
  const recentReports = reports.filter(r => Date.now() - r.timestamp <= 24 * 60 * 60 * 1000 && r.coords);

  useEffect(() => {
    // Filter sites by search
    const lowerSearch = search.toLowerCase();
    setFilteredSites(
      additionalSites.filter(site =>
        site.name.toLowerCase().includes(lowerSearch) ||
        site.status.toLowerCase().includes(lowerSearch)
      )
    );
  }, [search]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const virginiaCenter = [37.5407, -78.6569];
    const map = L.map(mapRef.current).setView(virginiaCenter, 7);
    mapInstanceRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  }, []);

  // Only show verified locations from the last 24 hours
  const now = Date.now();
  const recentVerifiedLocations = verifiedLocations.filter(loc => {
    // Support both Firestore Timestamp and JS timestamp
    const verifiedAt = loc.verifiedAt && loc.verifiedAt.seconds ? loc.verifiedAt.seconds * 1000 : loc.verifiedAt;
    return verifiedAt && (now - verifiedAt <= 24 * 60 * 60 * 1000);
  });

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    map.eachLayer(layer => {
      if (layer instanceof L.CircleMarker) map.removeLayer(layer);
    });
    // Show static sites
    filteredSites.forEach(site => {
      const marker = L.circleMarker(site.coords, {
        radius: 12,
        fillColor: statusColors[site.status],
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${site.name}</h3>
          <div style="display: flex; align-items: center; gap: 5px;">
            <i class="${statusIcons[site.status]}" style="color: ${statusColors[site.status]};"></i>
            <span style="text-transform: capitalize; font-weight: 600; color: ${statusColors[site.status]};">${site.status}</span>
          </div>
        </div>
      `);
    });
    // Show recent reports
    recentReports.forEach(report => {
      const marker = L.circleMarker([report.coords.lat, report.coords.lon], {
        radius: 14,
        fillColor: statusColors[report.status] || '#3498db',
        color: '#222',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(map);
      marker.bindPopup(`
        <div style="min-width: 220px;">
          <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${report.location}</h3>
          <p style="margin: 0 0 10px 0; color: #666;">${report.description || 'No description provided.'}</p>
          <div>Status: <span style="color: ${statusColors[report.status]}; font-weight: bold;">${report.status}</span></div>
          <div>Reported: ${new Date(report.timestamp).toLocaleString()}</div>
        </div>
      `);
    });
    // Show verified locations as special markers
    recentVerifiedLocations.forEach(loc => {
      if (loc.coords) {
        const marker = L.circleMarker([loc.coords.lat, loc.coords.lon], {
          radius: 16,
          fillColor: statusColors[loc.status] || '#2c3e50',
          color: '#000', // black outline
          weight: 3,
          opacity: 1,
          fillOpacity: 1
        }).addTo(map);
        marker.bindPopup(`
          <div style="min-width: 220px;">
            <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${loc.location} (Verified)</h3>
            <div>Status: <span style="color: ${statusColors[loc.status] || '#2c3e50'}; font-weight: bold;">${loc.status}</span></div>
            <div>Verified: ${loc.verifiedAt ? new Date(loc.verifiedAt.seconds ? loc.verifiedAt.seconds * 1000 : loc.verifiedAt).toLocaleString() : ''}</div>
          </div>
        `);
      }
    });
  }, [filteredSites, reports, recentVerifiedLocations]);

  return (
    <section className="map-section">
      <div className="container">
        <h2>Virginia Water Quality Map</h2>
        <p>Interactive map showing current water safety status across Virginia's major waterways</p>
        <input
          type="text"
          placeholder="Search by name or status..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: '16px', padding: '8px', width: '100%' }}
        />
        <div className="map-container">
          <div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>
          <div className="map-legend">
            <h4>Water Safety Status</h4>
            <div className="legend-item">
              <div className="status-indicator safe"></div>
              <span>Safe</span>
            </div>
            <div className="legend-item">
              <div className="status-indicator caution"></div>
              <span>Caution</span>
            </div>
            <div className="legend-item">
              <div className="status-indicator warning"></div>
              <span>Warning</span>
            </div>
            <div className="legend-item">
              <div className="status-indicator unsafe"></div>
              <span>Unsafe</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaterMap;
