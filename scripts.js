// --- Core Content Loading Function ---
function loadPage(pageId) {
    const pageContainer = document.getElementById('page-container');
    let contentFile = '';

    // Determine which HTML file to load based on the pageId
    if (pageId === 'introduction') {
        contentFile = 'institute.html';
    } else if (['lectures', 'charts', 'tabs', 'tables', 'forms'].includes(pageId)) {
        contentFile = 'teaching.html';
    } else if (['journal', 'conference', 'talk'].includes(pageId)) {
        contentFile = 'publication.html';
    } else {
        // Fallback for unknown pages (shouldn't happen with the current menu)
        pageContainer.innerHTML = `<div class="content-card"><h2>404 Not Found</h2><p>Page ID: ${pageId}</p></div>`;
        return;
    }

    // Fetch and inject the content file
    fetch(contentFile)
        .then(response => response.text())
        .then(html => {
            // Create a temporary container to hold the fetched HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Find the specific page content within the fetched HTML
            const selectedContent = tempDiv.querySelector(`#${pageId}`);
            
            if (selectedContent) {
                // Clear the container and insert the selected content
                pageContainer.innerHTML = '';
                pageContainer.appendChild(selectedContent);
                
                // Now that content is loaded, initialize dynamic elements
                initDynamicElements(pageId);
            } else {
                pageContainer.innerHTML = `<div class="content-card"><h2>Error: Content Not Found</h2><p>Could not find section #${pageId} in ${contentFile}.</p></div>`;
            }
        })
        .catch(error => {
            console.error('Error loading content:', error);
            pageContainer.innerHTML = `<div class="content-card"><h2>Error Loading Page</h2><p>Failed to load ${contentFile}.</p></div>`;
        });
}

// --- Dynamic Element Initialization ---
function initDynamicElements(pageId) {
    // Helper function to destroy existing Chart.js instances before re-initializing
    function destroyChart(id) {
        if (window[id] instanceof Chart) {
            window[id].destroy();
        }
    }

    // 1. Chart Initializations
    
    // Bar chart (In introduction/institute.html)
    if (pageId === 'introduction') {
        const ctx = document.getElementById('barChart');
        if (ctx) {
            destroyChart('barChartInstance');
            window.barChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Visitors',
                        data: [12000, 19000, 15000, 25000, 22000, 30000],
                        backgroundColor: ['rgba(52, 152, 219, 0.7)', 'rgba(46, 204, 113, 0.7)', 'rgba(155, 89, 182, 0.7)', 'rgba(241, 196, 15, 0.7)', 'rgba(230, 126, 34, 0.7)', 'rgba(231, 76, 60, 0.7)'],
                        borderColor: ['rgba(52, 152, 219, 1)', 'rgba(46, 204, 113, 1)', 'rgba(155, 89, 182, 1)', 'rgba(241, 196, 15, 1)', 'rgba(230, 126, 34, 1)', 'rgba(231, 76, 60, 1)'],
                        borderWidth: 1
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
            });
        }
    } else {
        destroyChart('barChartInstance');
    }
    
    // Charts page-specific charts (in teaching.html)
    if (pageId === 'charts') {
        const performanceCtx = document.getElementById('performanceChart');
        if (performanceCtx) {
            destroyChart('performanceChartInstance');
            window.performanceChartInstance = new Chart(performanceCtx, {
                type: 'pie',
                data: {
                    labels: ['Excellent (A)', 'Good (B)', 'Average (C)', 'Below Average (D/F)'],
                    datasets: [{
                        data: [35, 40, 20, 5],
                        backgroundColor: ['rgba(46, 204, 113, 0.7)', 'rgba(52, 152, 219, 0.7)', 'rgba(241, 196, 15, 0.7)', 'rgba(231, 76, 60, 0.7)'],
                        borderColor: ['rgba(46, 204, 113, 1)', 'rgba(52, 152, 219, 1)', 'rgba(241, 196, 15, 1)', 'rgba(231, 76, 60, 1)'],
                        borderWidth: 1
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
        
        const enrollmentCtx = document.getElementById('enrollmentChart');
        if (enrollmentCtx) {
            destroyChart('enrollmentChartInstance');
            window.enrollmentChartInstance = new Chart(enrollmentCtx, {
                type: 'line',
                data: {
                    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
                    datasets: [{
                        label: 'Computer Science',
                        data: [120, 145, 160, 185, 210, 240],
                        borderColor: 'rgba(52, 152, 219, 1)',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.3,
                        fill: true
                    }, {
                        label: 'Data Science',
                        data: [80, 95, 120, 150, 180, 210],
                        borderColor: 'rgba(46, 204, 113, 1)',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
            });
        }
    } else {
        destroyChart('performanceChartInstance');
        destroyChart('enrollmentChartInstance');
    }

    // 2. Tab functionality (in teaching.html/tabs)
    // Need to re-attach listeners since content is re-loaded
    if (pageId === 'tabs') {
        const tabButtons = document.querySelectorAll('#tabs .tab-button');
        tabButtons.forEach(button => {
            button.removeEventListener('click', handleTabClick);
            button.addEventListener('click', handleTabClick);
        });
        
        // Ensure the first tab is active when the page is loaded
        const initialActiveTab = document.querySelector('#tabs .tab-button');
        if (initialActiveTab && !initialActiveTab.classList.contains('active')) {
             handleTabClick.call(initialActiveTab);
        }
    }

    // 3. Form submission (in teaching.html/forms)
    const form = document.getElementById('registration-form');
    if (form) {
        form.removeEventListener('submit', handleFormSubmit);
        if (pageId === 'forms') {
            form.addEventListener('submit', handleFormSubmit);
        }
    }
}

function handleTabClick() {
    const tabId = this.dataset.tab;
    const tabContainer = this.closest('.tabs-container');
    
    // Remove active class from all tabs and contents in this container
    tabContainer.querySelectorAll('.tab-button').forEach(tab => {
        tab.classList.remove('active');
    });
    tabContainer.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to clicked tab and corresponding content
    this.classList.add('active');
    tabContainer.querySelector(`#${tabId}`).classList.add('active');
}

function handleFormSubmit(e) {
    e.preventDefault();
    alert('Course registration submitted successfully!');
    this.reset();
}


// --- Main Execution Block ---
document.addEventListener('DOMContentLoaded', function() {
    // 1. Set up navigation click handlers
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            document.querySelectorAll('.menu-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Load the corresponding page content
            const pageId = this.dataset.page;
            if (pageId) {
                loadPage(pageId);
            }
        });
    });

    // 2. Load the initial page ('introduction')
    loadPage('introduction');
});
