// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    initializeNavigation();
    initializeReportForm();
    updateDashboard();
});

// Map initialization
function initializeMap() {
    // Virginia center coordinates
    const virginiaCenter = [37.5407, -78.6569];
    
    // Initialize the map
    const map = L.map('waterMap').setView(virginiaCenter, 7);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Virginia water bodies data with status
    const waterBodies = [
        {
            name: "Lake Anna",
            coords: [38.0833, -77.9167],
            status: "warning",
            description: "Elevated algae levels detected. Avoid swimming in North Anna Branch."
        },
        {
            name: "Occoquan Reservoir",
            coords: [38.7500, -77.4167],
            status: "caution",
            description: "PFAS levels above EPA limits. Monitor for updates."
        },
        {
            name: "Chickahominy River",
            coords: [37.4167, -77.2500],
            status: "caution",
            description: "Moderate risk of algal bloom. Monitor conditions."
        },
        {
            name: "James River",
            coords: [37.5333, -77.4333],
            status: "safe",
            description: "Water quality within normal parameters."
        },
        {
            name: "Potomac River",
            coords: [38.8000, -77.0500],
            status: "safe",
            description: "Clear conditions, safe for recreation."
        },
        {
            name: "Shenandoah River",
            coords: [38.9167, -78.1833],
            status: "safe",
            description: "Excellent water quality conditions."
        },
        {
            name: "Smith Mountain Lake",
            coords: [37.0833, -79.7500],
            status: "caution",
            description: "Seasonal monitoring in progress."
        },
        {
            name: "Kerr Reservoir",
            coords: [36.5833, -78.5833],
            status: "safe",
            description: "All clear for water activities."
        },
        {
            name: "Claytor Lake",
            coords: [37.0833, -80.5833],
            status: "safe",
            description: "Good water quality maintained."
        },
        {
            name: "Lake Gaston",
            coords: [36.5833, -78.0833],
            status: "warning",
            description: "Recent reports of algae presence. Use caution."
        }
    ];
    
    // Status colors
    const statusColors = {
        safe: '#27ae60',
        caution: '#f39c12',
        warning: '#e74c3c',
        unsafe: '#8e44ad'
    };
    
    // Status icons
    const statusIcons = {
        safe: 'fas fa-check-circle',
        caution: 'fas fa-exclamation-triangle',
        warning: 'fas fa-exclamation-circle',
        unsafe: 'fas fa-times-circle'
    };
    
    // Add markers for each water body
    waterBodies.forEach(waterBody => {
        const marker = L.circleMarker(waterBody.coords, {
            radius: 12,
            fillColor: statusColors[waterBody.status],
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        // Add popup with information
        marker.bindPopup(`
            <div style="min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${waterBody.name}</h3>
                <p style="margin: 0 0 10px 0; color: #666;">${waterBody.description}</p>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <i class="${statusIcons[waterBody.status]}" style="color: ${statusColors[waterBody.status]};"></i>
                    <span style="text-transform: capitalize; font-weight: 600; color: ${statusColors[waterBody.status]};">${waterBody.status}</span>
                </div>
            </div>
        `);
        
        // Add click event to marker
        marker.on('click', function() {
            // You can add additional functionality here
            console.log(`Clicked on ${waterBody.name}`);
        });
    });
    
    // Store map reference for later use
    window.waterMap = map;
}

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Report form functionality
function initializeReportForm() {
    const reportForm = document.getElementById('reportForm');
    
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(reportForm);
        const reportData = {
            location: formData.get('location'),
            waterCondition: formData.get('waterCondition'),
            smell: formData.get('smell'),
            description: formData.get('description'),
            contact: formData.get('contact'),
            timestamp: new Date().toISOString()
        };
        
        // Simulate form submission
        console.log('Report submitted:', reportData);
        
        // Show success message
        showNotification('Thank you for your report! It has been submitted for review.', 'success');
        
        // Reset form
        reportForm.reset();
        
        // In a real application, you would send this data to a server
        // fetch('/api/reports', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(reportData)
        // });
    });
}

// Dashboard updates
function updateDashboard() {
    // Simulate real-time updates
    setInterval(function() {
        updateWeatherData();
        updateRecentReports();
    }, 30000); // Update every 30 seconds
}

function updateWeatherData() {
    // Simulate weather data updates
    const temperature = Math.floor(Math.random() * 10) + 75; // 75-85°F
    const rainfall = (Math.random() * 0.5).toFixed(1); // 0-0.5 inches
    const windSpeed = Math.floor(Math.random() * 10) + 3; // 3-13 mph
    
    // Update weather display (if elements exist)
    const tempElement = document.querySelector('.weather-item:nth-child(1) span');
    const rainElement = document.querySelector('.weather-item:nth-child(2) span');
    const windElement = document.querySelector('.weather-item:nth-child(3) span');
    
    if (tempElement) tempElement.textContent = `Temperature: ${temperature}°F`;
    if (rainElement) rainElement.textContent = `Rainfall: ${rainfall}" (24h)`;
    if (windElement) windElement.textContent = `Wind: ${windSpeed} mph SW`;
    
    // Update bloom risk based on conditions
    updateBloomRisk(temperature, rainfall, windSpeed);
}

function updateBloomRisk(temperature, rainfall, windSpeed) {
    const riskMeter = document.querySelector('.risk-fill');
    const riskText = document.querySelector('.risk-meter span');
    
    if (!riskMeter || !riskText) return;
    
    // Simple risk calculation based on temperature, rainfall, and wind
    let riskLevel = 'low';
    let riskPercentage = 25;
    
    if (temperature > 80 && rainfall > 0.3) {
        riskLevel = 'high';
        riskPercentage = 75;
    } else if (temperature > 78 || rainfall > 0.2) {
        riskLevel = 'medium';
        riskPercentage = 50;
    }
    
    if (windSpeed > 10) {
        riskPercentage = Math.max(25, riskPercentage - 15); // Wind helps reduce risk
    }
    
    riskMeter.className = `risk-fill ${riskLevel}`;
    riskMeter.style.width = `${riskPercentage}%`;
    riskText.textContent = `${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk`;
}

function updateRecentReports() {
    // Simulate new reports coming in
    const reportsList = document.querySelector('.reports-list');
    if (!reportsList) return;
    
    // In a real application, this would fetch new reports from the server
    // For demo purposes, we'll just add some variety to existing reports
    const locations = ['Occoquan Reservoir', 'James River', 'Potomac River', 'Shenandoah River'];
    const conditions = ['Clear water, no visible algae', 'Greenish tint observed', 'Normal conditions', 'Slight discoloration'];
    const statuses = ['safe', 'caution'];
    
    // Occasionally add a new report (10% chance every update)
    if (Math.random() < 0.1) {
        const newReport = createReportElement(
            locations[Math.floor(Math.random() * locations.length)],
            conditions[Math.floor(Math.random() * conditions.length)],
            statuses[Math.floor(Math.random() * statuses.length)]
        );
        
        reportsList.insertBefore(newReport, reportsList.firstChild);
        
        // Keep only the 5 most recent reports
        while (reportsList.children.length > 5) {
            reportsList.removeChild(reportsList.lastChild);
        }
    }
}

function createReportElement(location, condition, status) {
    const reportItem = document.createElement('div');
    reportItem.className = 'report-item';
    
    const now = new Date();
    const timeAgo = Math.floor(Math.random() * 6) + 1; // 1-6 hours ago
    
    reportItem.innerHTML = `
        <div class="report-header">
            <span class="report-location">${location}</span>
            <span class="report-time">${timeAgo} hours ago</span>
        </div>
        <p>${condition}</p>
        <div class="report-status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</div>
    `;
    
    return reportItem;
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    });
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    }
`;
document.head.appendChild(style);

// Utility function to format dates
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Export functions for global access
window.scrollToSection = scrollToSection;
window.showNotification = showNotification;
