// Function to initialize charts, tabs, and forms on page load
function initializePageContent() {
    // === 1. Navigation Logic ===
    const menuItems = document.querySelectorAll('.sidebar .menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Deactivate all menu items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Activate the clicked item
            this.classList.add('active');
            
            // Hide all pages
            document.querySelectorAll('.main-content > .page-content').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show the selected page
            const pageId = this.dataset.page;
            const selectedPage = document.getElementById(pageId);
            if (selectedPage) {
                selectedPage.classList.add('active');
                
                // Re-run the initialization function to ensure charts and tabs in the new page are active
                initDynamicElements(pageId);
            }
        });
    });

    // Run initialization for the active page on initial load
    const activeItem = document.querySelector('.sidebar .menu-item.active');
    if (activeItem) {
        initDynamicElements(activeItem.dataset.page);
    }
}

// Function to initialize elements that need JavaScript (Charts, Tabs, Forms)
function initDynamicElements(pageId) {
    // === 2. Initialize Charts (Bar, Performance, Enrollment) ===
    // Note: Chart.js prevents re-initialization on the same canvas, so we check if the canvas exists and is not already a chart.
    
    // Bar chart (In institute)
    if (pageId === 'institute' && document.getElementById('barChart')) {
        const ctx = document.getElementById('barChart').getContext('2d');
        // Destroy existing chart if it exists
        if (window.barChartInstance) window.barChartInstance.destroy();
        
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

    // Performance and Enrollment charts (In teaching)
    if (pageId === 'teaching') {
        if (document.getElementById('performanceChart')) {
            const performanceCtx = document.getElementById('performanceChart').getContext('2d');
            if (window.performanceChartInstance) window.performanceChartInstance.destroy();
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
    
        if (document.getElementById('enrollmentChart')) {
            const enrollmentCtx = document.getElementById('enrollmentChart').getContext('2d');
            if (window.enrollmentChartInstance) window.enrollmentChartInstance.destroy();
            window.enrollmentChartInstance = new Chart(enrollmentCtx, {
                type: 'line',
                data: {
                    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
                    datasets: [{
                        label: 'Computer Science',
                        data: [120, 145, 160, 185, 210, 240],
                        borderColor: 'rgba(52, 152, 219, 1)',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.3, fill: true
                    }, {
                        label: 'Data Science',
                        data: [80, 95, 120, 150, 180, 210],
                        borderColor: 'rgba(46, 204, 113, 1)',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        tension: 0.3, fill: true
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
            });
        }

        // === 3. Tab functionality (In teaching) ===
        document.querySelectorAll('#teaching .tab-button').forEach(button => {
            // Remove previous listeners to prevent multiple execution
            button.removeEventListener('click', handleTabClick);
            button.addEventListener('click', handleTabClick);
        });

        // Set initial active tab state for the teaching page
        const tabsContainer = document.querySelector('#teaching .tabs-container');
        if (tabsContainer) {
            tabsContainer.querySelector('.tab-button').classList.add('active');
            tabsContainer.querySelector('.tab-content').classList.add('active');
        }
    }
    
    // === 4. Form submission (In teaching) ===
    const form = document.getElementById('registration-form');
    if (form) {
        // Remove previous listeners
        form.removeEventListener('submit', handleFormSubmit);
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Handler functions to avoid re-adding listeners unnecessarily
function handleTabClick() {
    const tabId = this.dataset.tab;
    document.querySelectorAll('#teaching .tab-button').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('#teaching .tab-content').forEach(content => content.classList.remove('active'));
    this.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function handleFormSubmit(e) {
    e.preventDefault();
    alert('Course registration submitted successfully!');
    this.reset();
}

document.addEventListener('DOMContentLoaded', initializePageContent);
