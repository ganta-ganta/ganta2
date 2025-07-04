// Ad Manager Configuration
const adManagerConfig = {
    adServerUrl: 'https://gantasolutions.com/adplacer.html',
    rotationInterval: 30000, // 30 seconds
    isRotationActive: true,
    enableAdminControls: true, // Set to false to disable admin controls
    adContainers: [
        { id: 'leaderboard-ad', type: 'leaderboard', size: '728x90' },
        { id: 'sidebar-ad', type: 'sidebar', size: '300x250' },
        { id: 'banner-ad', type: 'banner', size: '468x60' }
    ],
    stats: {
        totalImpressions: 0,
        totalClicks: 0,
        adImpressions: {}
    }
};

// Initialize Ad Manager
document.addEventListener('DOMContentLoaded', function() {
    // Load initial ads
    loadAds();
    
    // Set up rotation
    if (adManagerConfig.isRotationActive) {
        startAdRotation();
    }
    
    // Initialize admin controls if enabled
    if (adManagerConfig.enableAdminControls) {
        initAdminControls();
    }
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

// Load ads from server
function loadAds() {
    adManagerConfig.adContainers.forEach(container => {
        fetchAd(container.id, container.type, container.size);
    });
}

// Fetch ad from server
function fetchAd(containerId, adType, adSize) {
    // In a real implementation, this would fetch from your API
    // For demo, we'll use mock data with a simulated delay
    
    // Simulate API call with timeout
    setTimeout(() => {
        // Mock ad data - in real implementation, get this from your server
        const mockAds = {
            leaderboard: [
                { id: 'ad1', image: 'https://via.placeholder.com/728x90', url: 'https://example.com', alt: 'Advertisement 1' },
                { id: 'ad5', image: 'https://via.placeholder.com/728x90/333/fff', url: 'https://example.com', alt: 'Advertisement 5' }
            ],
            sidebar: [
                { id: 'ad2', image: 'https://via.placeholder.com/300x250', url: 'https://example.com', alt: 'Advertisement 2' },
                { id: 'ad6', image: 'https://via.placeholder.com/300x250/555/fff', url: 'https://example.com', alt: 'Advertisement 6' }
            ],
            banner: [
                { id: 'ad3', image: 'https://via.placeholder.com/468x60', url: 'https://example.com', alt: 'Advertisement 3' },
                { id: 'ad7', image: 'https://via.placeholder.com/468x60/777/fff', url: 'https://example.com', alt: 'Advertisement 7' }
            ]
        };
        
        // Select random ad for this container
        const ads = mockAds[adType] || mockAds.leaderboard;
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        
        // Display the ad
        displayAd(containerId, randomAd);
        
        // Track impression
        trackImpression(randomAd.id);
    }, 300); // Simulate network delay
}

// Display ad in container
function displayAd(containerId, adData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const adContent = container.querySelector('.ad-content');
    const adStats = container.querySelector('.ad-stats');
    
    // Create ad HTML
    adContent.innerHTML = `
        <a href="${adData.url}" class="ad-link" data-ad-id="${adData.id}" target="_blank">
            <img src="${adData.image}" alt="${adData.alt}" class="ad-image">
        </a>
    `;
    
    // Update stats display
    const impressions = adManagerConfig.stats.adImpressions[adData.id] || 0;
    adStats.textContent = `Ad ID: ${adData.id} | Impressions: ${impressions}`;
    
    // Set up click tracking
    const adLink = adContent.querySelector('.ad-link');
    if (adLink) {
        adLink.addEventListener('click', function(e) {
            trackClick(adData.id);
        });
    }
}

// Track ad impression
function trackImpression(adId) {
    // Update total impressions
    adManagerConfig.stats.totalImpressions++;
    
    // Update ad-specific impressions
    if (!adManagerConfig.stats.adImpressions[adId]) {
        adManagerConfig.stats.adImpressions[adId] = 0;
    }
    adManagerConfig.stats.adImpressions[adId]++;
    
    // In a real implementation, send this data to your server
    console.log(`Impression tracked for ad ${adId}`);
}

// Track ad click
function trackClick(adId) {
    // Update total clicks
    adManagerConfig.stats.totalClicks++;
    
    // In a real implementation, send this data to your server
    console.log(`Click tracked for ad ${adId}`);
    
    // You could also navigate to the URL via your server for tracking
    // window.location.href = `${adManagerConfig.adServerUrl}/track?type=click&ad=${adId}&redirect=${encodeURIComponent(adData.url)}`;
}

// Ad rotation control
let rotationInterval;
function startAdRotation() {
    if (rotationInterval) clearInterval(rotationInterval);
    rotationInterval = setInterval(() => {
        if (adManagerConfig.isRotationActive) {
            loadAds();
        }
    }, adManagerConfig.rotationInterval);
}

function stopAdRotation() {
    if (rotationInterval) clearInterval(rotationInterval);
}

// Handle page visibility changes
function handleVisibilityChange() {
    if (document.hidden) {
        stopAdRotation();
    } else if (adManagerConfig.isRotationActive) {
        startAdRotation();
    }
}

// Admin controls
function initAdminControls() {
    const adminControls = document.getElementById('admin-controls');
    if (adminControls) adminControls.style.display = 'block';
    
    // Refresh ads button
    const refreshBtn = document.getElementById('refresh-ads');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadAds();
        });
    }
    
    // Toggle rotation button
    const toggleBtn = document.getElementById('toggle-rotation');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            adManagerConfig.isRotationActive = !adManagerConfig.isRotationActive;
            if (adManagerConfig.isRotationActive) {
                startAdRotation();
                toggleBtn.textContent = 'Pause Rotation';
            } else {
                stopAdRotation();
                toggleBtn.textContent = 'Resume Rotation';
            }
        });
    }
    
    // Rotation speed control
    const speedInput = document.getElementById('rotation-speed');
    if (speedInput) {
        speedInput.addEventListener('change', function() {
            const newSpeed = parseInt(this.value) * 1000;
            if (newSpeed >= 5000) { // Minimum 5 seconds
                adManagerConfig.rotationInterval = newSpeed;
                if (adManagerConfig.isRotationActive) {
                    startAdRotation();
                }
            }
        });
    }
}
