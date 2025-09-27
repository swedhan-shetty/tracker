// Supplement Archive Application
class SupplementArchive {
    constructor() {
        this.supplements = [
            {
                id: 1,
                name: "Vitamin D3",
                category: "Essential Lifelong",
                dosage: "2000-4000 IU daily",
                megaDosing: "Can go up to 10,000 IU short-term with monitoring",
                timing: "With fat-containing meal for better absorption",
                costPerMonth: 300,
                costRange: "₹200-400",
                roi: "Excellent - cheap, proven benefits for bone health, immune system",
                purpose: "Bone health, immune support, hormone optimization",
                notes: "One of the most cost-effective supplements. Get blood levels tested.",
                inCurrentStack: true,
                currentDosage: "3000 IU",
                startDate: "2024-07-15",
                goals: ["general_health", "hormone_optimization"],
                evidenceRating: 5
            },
            {
                id: 2,
                name: "Whey Protein Concentrate",
                category: "Essential Lifelong", 
                dosage: "20-30g per serving",
                megaDosing: "Not applicable - use as needed for protein targets",
                timing: "Post-workout or throughout day to meet protein goals",
                costPerMonth: 1600,
                costRange: "₹1200-2000",
                roi: "Good - helps meet protein targets cost-effectively",
                purpose: "Muscle building, convenient protein source",
                notes: "Compared Indian market options for best protein-to-cost ratio",
                inCurrentStack: true,
                currentDosage: "25g daily",
                startDate: "2024-07-15",
                goals: ["muscle_gain", "fat_loss"],
                evidenceRating: 5
            },
            {
                id: 3,
                name: "Ashwagandha",
                category: "Goal-Specific",
                dosage: "300-600mg daily",
                megaDosing: "Up to 1000mg for stress management",
                timing: "Evening or before bed to avoid sedation",
                costPerMonth: 600,
                costRange: "₹400-800",
                roi: "Moderate - good for stress and potentially testosterone",
                purpose: "Stress reduction, sleep quality, testosterone support",
                notes: "Researched for natural testosterone boosting",
                inCurrentStack: false,
                currentDosage: "",
                goals: ["hormone_optimization", "stress_management"],
                evidenceRating: 4
            },
            {
                id: 4,
                name: "L-Carnitine",
                category: "Goal-Specific",
                dosage: "2-3g daily",
                megaDosing: "Not recommended above 3g",
                timing: "Pre-workout or with meals",
                costPerMonth: 1000,
                costRange: "₹800-1200",
                roi: "Situational - makes sense during fat loss phases",
                purpose: "Fat oxidation, exercise performance",
                notes: "Considering for weight loss challenge. ROI depends on goals.",
                inCurrentStack: false,
                currentDosage: "",
                goals: ["fat_loss", "performance"],
                evidenceRating: 3
            },
            {
                id: 5,
                name: "Zinc",
                category: "Essential Lifelong",
                dosage: "10-15mg daily",
                megaDosing: "Max 30mg, can interfere with copper absorption",
                timing: "Empty stomach or 2 hours after meals",
                costPerMonth: 225,
                costRange: "₹150-300",
                roi: "Good - cheap and important for immunity and hormones",
                purpose: "Immune function, testosterone support, wound healing",
                notes: "Compared options focusing on absorption and price",
                inCurrentStack: true,
                currentDosage: "12mg",
                startDate: "2024-08-01",
                goals: ["general_health", "hormone_optimization"],
                evidenceRating: 5
            },
            {
                id: 6,
                name: "Pre-workout Supplement",
                category: "Wishlist",
                dosage: "As per label instructions",
                megaDosing: "Not recommended - follow label",
                timing: "30 minutes before training",
                costPerMonth: 1250,
                costRange: "₹1000-1500",
                roi: "Unknown - need to research specific ingredients",
                purpose: "Enhanced training performance and focus",
                notes: "Interested for cardio and weight training performance",
                inCurrentStack: false,
                currentDosage: "",
                goals: ["performance", "fat_loss"],
                evidenceRating: 3
            },
            {
                id: 7,
                name: "5-HTP",
                category: "Uncertain/Trial",
                dosage: "100-300mg daily",
                megaDosing: "Not recommended above 300mg",
                timing: "Evening, away from protein meals",
                costPerMonth: 750,
                costRange: "₹600-900",
                roi: "Uncertain - need more research on effectiveness",
                purpose: "Sleep quality, mood support, appetite control",
                notes: "Researched but unsure about adding to stack",
                inCurrentStack: false,
                currentDosage: "",
                goals: ["sleep_quality", "fat_loss"],
                evidenceRating: 3
            },
            {
                id: 8,
                name: "Rauwolscine/Alpha-Yohimbine",
                category: "Uncertain/Trial",
                dosage: "0.2mg per kg bodyweight",
                megaDosing: "Not recommended - can cause side effects",
                timing: "Fasted state, pre-cardio",
                costPerMonth: 1000,
                costRange: "₹800-1200",
                roi: "Uncertain - limited evidence for fat loss",
                purpose: "Stubborn fat loss, pre-workout energy",
                notes: "Researched with product links, but uncertain about effectiveness",
                inCurrentStack: false,
                currentDosage: "",
                goals: ["fat_loss"],
                evidenceRating: 2
            }
        ];

        this.goals = [
            {id: "fat_loss", name: "Fat Loss", target: "Lose 18kg fat", progress: "6kg lost", active: true},
            {id: "muscle_gain", name: "Muscle Gain", target: "Maintain/gain muscle during cut", progress: "Maintaining", active: true},
            {id: "general_health", name: "General Health", target: "Optimize health markers", progress: "On track", active: true},
            {id: "hormone_optimization", name: "Hormone Optimization", target: "Optimize testosterone naturally", progress: "In progress", active: false},
            {id: "performance", name: "Performance", target: "Improve workout performance", progress: "Gradual improvement", active: false}
        ];

        this.monthlySpending = [
            {month: "Jul 2024", amount: 1900, supplements: 3},
            {month: "Aug 2024", amount: 2125, supplements: 3},
            {month: "Sep 2024", amount: 2125, supplements: 3}
        ];

        this.budget = {
            monthly: 3000,
            yearly: 36000
        };

        this.recommendations = [
            {
                supplement: "L-Carnitine",
                reason: "Currently pursuing fat loss goal - 6kg lost out of 18kg target",
                roi: "Good ROI during active fat loss phases",
                budgetImpact: "Would increase monthly spend to ₹3,125 (still under budget)",
                priority: "High"
            },
            {
                supplement: "Ashwagandha", 
                reason: "May support testosterone optimization and stress management",
                roi: "Moderate - good for secondary goals",
                budgetImpact: "Would increase monthly spend to ₹2,725",
                priority: "Medium"
            }
        ];

        this.categories = [
            "Essential Lifelong",
            "Goal-Specific", 
            "Uncertain/Trial",
            "Wishlist"
        ];

        this.currentView = 'library';
        this.editingId = null;
        this.filteredSupplements = [...this.supplements];
        this.charts = {};

        this.init();
    }

    init() {
        this.bindEvents();
        this.switchView('library');
        this.updateStackSummary();
    }

    bindEvents() {
        // Navigation
        document.getElementById('libraryBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchView('library');
        });
        
        document.getElementById('stackBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchView('stack');
        });

        document.getElementById('analyticsBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchView('analytics');
        });

        document.getElementById('recommendationsBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchView('recommendations');
        });

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Add supplement
        document.getElementById('addSupplementBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal();
        });

        // Export buttons
        document.getElementById('exportLibraryBtn')?.addEventListener('click', () => this.exportLibraryCSV());
        document.getElementById('exportStackBtn')?.addEventListener('click', () => this.exportStackCSV());
        document.getElementById('exportAnalyticsBtn')?.addEventListener('click', () => this.exportAnalyticsCSV());

        // Modal events
        document.getElementById('closeModal').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal();
        });
        
        document.getElementById('cancelBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal();
        });
        
        document.getElementById('supplementModal').addEventListener('click', (e) => {
            if (e.target.id === 'supplementModal') {
                this.closeModal();
            }
        });

        // Form events
        document.getElementById('inCurrentStack').addEventListener('change', (e) => {
            const dosageGroup = document.getElementById('currentDosageGroup');
            dosageGroup.style.display = e.target.checked ? 'block' : 'none';
        });

        document.getElementById('supplementForm').addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // Event delegation for dynamic buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                e.preventDefault();
                const id = parseInt(e.target.dataset.id);
                this.editSupplement(id);
            } else if (e.target.classList.contains('delete-btn')) {
                e.preventDefault();
                const id = parseInt(e.target.dataset.id);
                this.deleteSupplement(id);
            } else if (e.target.classList.contains('remove-from-stack')) {
                e.preventDefault();
                const id = parseInt(e.target.dataset.id);
                this.removeFromStack(id);
            } else if (e.target.classList.contains('toggle-stack-btn')) {
                e.preventDefault();
                const id = parseInt(e.target.dataset.id);
                this.toggleStack(id);
            }
        });
    }

    switchView(view) {
        this.currentView = view;
        
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Hide all views
        document.querySelectorAll('.view').forEach(viewEl => {
            viewEl.classList.add('hidden');
        });

        // Show current view and activate button
        if (view === 'library') {
            document.getElementById('libraryBtn').classList.add('active');
            document.getElementById('libraryView').classList.remove('hidden');
            this.renderLibrary();
        } else if (view === 'stack') {
            document.getElementById('stackBtn').classList.add('active');
            document.getElementById('stackView').classList.remove('hidden');
            this.renderCurrentStack();
        } else if (view === 'analytics') {
            document.getElementById('analyticsBtn').classList.add('active');
            document.getElementById('analyticsView').classList.remove('hidden');
            setTimeout(() => this.renderAnalytics(), 100); // Small delay for DOM to be ready
        } else if (view === 'recommendations') {
            document.getElementById('recommendationsBtn').classList.add('active');
            document.getElementById('recommendationsView').classList.remove('hidden');
            this.renderRecommendations();
        }
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.filteredSupplements = [...this.supplements];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredSupplements = this.supplements.filter(supplement => 
                supplement.name.toLowerCase().includes(searchTerm) ||
                supplement.purpose.toLowerCase().includes(searchTerm) ||
                supplement.notes.toLowerCase().includes(searchTerm)
            );
        }
        this.renderLibrary();
    }

    renderLibrary() {
        this.categories.forEach(category => {
            const gridId = this.getCategoryGridId(category);
            const grid = document.getElementById(gridId);
            if (grid) {
                const categorySupplements = this.filteredSupplements.filter(s => s.category === category);
                grid.innerHTML = categorySupplements.map(supplement => this.createSupplementCard(supplement)).join('');
            }
        });
    }

    getCategoryGridId(category) {
        const gridMap = {
            'Essential Lifelong': 'essentialGrid',
            'Goal-Specific': 'goalGrid',
            'Uncertain/Trial': 'uncertainGrid',
            'Wishlist': 'wishlistGrid'
        };
        return gridMap[category];
    }

    createSupplementCard(supplement) {
        const costDisplay = supplement.costPerMonth ? `₹${supplement.costPerMonth}` : supplement.costRange || 'Cost TBD';
        
        return `
            <div class="supplement-card" data-id="${supplement.id}">
                <div class="supplement-card__header">
                    <h4 class="supplement-card__title">${supplement.name}</h4>
                    ${supplement.inCurrentStack ? '<span class="supplement-card__badge">In Stack</span>' : ''}
                    <div class="supplement-card__actions">
                        <button class="action-btn edit-btn" data-id="${supplement.id}" title="Edit">✏️</button>
                        <button class="action-btn delete-btn" data-id="${supplement.id}" title="Delete">🗑️</button>
                        <button class="action-btn toggle-stack-btn" data-id="${supplement.id}" title="${supplement.inCurrentStack ? 'Remove from Stack' : 'Add to Stack'}">
                            ${supplement.inCurrentStack ? '➖' : '➕'}
                        </button>
                    </div>
                </div>
                <div class="supplement-card__info">
                    ${supplement.dosage ? `
                        <div class="info-item">
                            <span class="info-label">Dosage</span>
                            <span class="info-value">${supplement.dosage}</span>
                        </div>
                    ` : ''}
                    ${supplement.timing ? `
                        <div class="info-item">
                            <span class="info-label">Timing</span>
                            <span class="info-value">${supplement.timing}</span>
                        </div>
                    ` : ''}
                    <div class="info-item">
                        <span class="info-label">Cost per Month</span>
                        <span class="info-value cost-highlight">${costDisplay}</span>
                    </div>
                    ${supplement.purpose ? `
                        <div class="info-item">
                            <span class="info-label">Purpose</span>
                            <span class="info-value">${supplement.purpose}</span>
                        </div>
                    ` : ''}
                    ${supplement.roi ? `
                        <div class="info-item">
                            <span class="info-label">ROI</span>
                            <span class="info-value">${supplement.roi}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderCurrentStack() {
        const currentStack = this.supplements.filter(s => s.inCurrentStack);
        const stackGrid = document.getElementById('currentStackGrid');
        
        if (currentStack.length === 0) {
            stackGrid.innerHTML = '';
            return;
        }

        stackGrid.innerHTML = currentStack.map(supplement => this.createStackCard(supplement)).join('');
        this.updateStackSummary();
    }

    createStackCard(supplement) {
        const costDisplay = supplement.costPerMonth ? `₹${supplement.costPerMonth}` : 'Cost TBD';
        
        return `
            <div class="stack-card" data-id="${supplement.id}">
                <div class="stack-card__header">
                    <h4 class="stack-card__title">${supplement.name}</h4>
                    <span class="stack-card__current-dose">${supplement.currentDosage || 'Not specified'}</span>
                </div>
                <div class="stack-card__details">
                    <div class="stack-detail">
                        <span class="detail-label">Recommended</span>
                        <span class="detail-value">${supplement.dosage || 'N/A'}</span>
                    </div>
                    <div class="stack-detail">
                        <span class="detail-label">Monthly Cost</span>
                        <span class="detail-value">${costDisplay}</span>
                    </div>
                    <div class="stack-detail">
                        <span class="detail-label">Timing</span>
                        <span class="detail-value">${supplement.timing || 'N/A'}</span>
                    </div>
                    <div class="stack-detail">
                        <span class="detail-label">Purpose</span>
                        <span class="detail-value">${supplement.purpose || 'N/A'}</span>
                    </div>
                </div>
                <div class="stack-card__actions">
                    <button class="remove-from-stack" data-id="${supplement.id}">
                        Remove from Stack
                    </button>
                    <button class="action-btn edit-btn" data-id="${supplement.id}">Edit</button>
                </div>
            </div>
        `;
    }

    updateStackSummary() {
        const currentStack = this.supplements.filter(s => s.inCurrentStack);
        const totalCost = currentStack.reduce((sum, s) => sum + (s.costPerMonth || 0), 0);
        
        document.getElementById('totalSupplements').textContent = currentStack.length;
        document.getElementById('monthlyCost').textContent = `₹${totalCost}`;
        
        const remaining = this.budget.monthly - totalCost;
        const budgetRemainingEl = document.getElementById('budgetRemaining');
        if (budgetRemainingEl) {
            budgetRemainingEl.textContent = `₹${remaining}`;
        }
    }

    renderAnalytics() {
        this.updateBudgetOverview();
        this.renderSpendingChart();
        this.renderCategoryChart();
    }

    updateBudgetOverview() {
        const currentStack = this.supplements.filter(s => s.inCurrentStack);
        const currentSpending = currentStack.reduce((sum, s) => sum + (s.costPerMonth || 0), 0);
        const remaining = this.budget.monthly - currentSpending;
        const percentage = Math.round((currentSpending / this.budget.monthly) * 100);

        document.getElementById('currentSpending').textContent = `₹${currentSpending.toLocaleString()}`;
        document.getElementById('remainingBudget').textContent = `₹${remaining.toLocaleString()}`;
        document.getElementById('budgetProgress').style.width = `${Math.min(percentage, 100)}%`;
        document.querySelector('.progress-text').textContent = `${percentage}% of budget used`;
    }

    renderSpendingChart() {
        const ctx = document.getElementById('spendingChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.spending) {
            this.charts.spending.destroy();
        }

        this.charts.spending = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.monthlySpending.map(m => m.month),
                datasets: [{
                    label: 'Monthly Spending',
                    data: this.monthlySpending.map(m => m.amount),
                    borderColor: '#50b8c6',
                    backgroundColor: 'rgba(80, 184, 198, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#cccccc',
                            callback: function(value) {
                                return '₹' + value;
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cccccc'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    renderCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.category) {
            this.charts.category.destroy();
        }

        // Calculate cost by category - only for supplements in current stack
        const categoryData = {};
        const currentStackSupplements = this.supplements.filter(s => s.inCurrentStack);
        
        // Initialize all categories that have active supplements
        currentStackSupplements.forEach(supplement => {
            const category = supplement.category;
            if (!categoryData[category]) {
                categoryData[category] = 0;
            }
            categoryData[category] += supplement.costPerMonth || 0;
        });

        // Only proceed if we have data
        if (Object.keys(categoryData).length === 0) {
            ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
            return;
        }

        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
        const labels = Object.keys(categoryData);
        const data = Object.values(categoryData);

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderColor: '#2d2d2d',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ₹${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    renderRecommendations() {
        const grid = document.getElementById('recommendationsGrid');
        grid.innerHTML = this.recommendations.map(rec => this.createRecommendationCard(rec)).join('');
    }

    createRecommendationCard(recommendation) {
        const priorityClass = recommendation.priority.toLowerCase().replace(' ', '-');
        
        return `
            <div class="recommendation-card ${priorityClass}-priority">
                <h4>${recommendation.supplement}</h4>
                <span class="priority-badge priority-${priorityClass}">${recommendation.priority} Priority</span>
                <div class="recommendation-reason">${recommendation.reason}</div>
                <div class="recommendation-details">
                    <div><strong>ROI:</strong> ${recommendation.roi}</div>
                    <div><strong>Budget Impact:</strong> ${recommendation.budgetImpact}</div>
                </div>
            </div>
        `;
    }

    // Export functions
    exportLibraryCSV() {
        const csvContent = this.convertToCSV(this.supplements, [
            'id', 'name', 'category', 'dosage', 'timing', 'costPerMonth', 
            'purpose', 'roi', 'notes', 'inCurrentStack', 'currentDosage'
        ]);
        this.downloadCSV(csvContent, 'supplement-library.csv');
    }

    exportStackCSV() {
        const currentStack = this.supplements.filter(s => s.inCurrentStack);
        const csvContent = this.convertToCSV(currentStack, [
            'name', 'currentDosage', 'costPerMonth', 'timing', 'purpose', 'startDate'
        ]);
        this.downloadCSV(csvContent, 'current-stack.csv');
    }

    exportAnalyticsCSV() {
        const data = [
            ...this.monthlySpending.map(m => ({type: 'Monthly Spending', ...m})),
            {type: 'Budget', monthly: this.budget.monthly, yearly: this.budget.yearly}
        ];
        const csvContent = this.convertToCSV(data, ['type', 'month', 'amount', 'supplements', 'monthly', 'yearly']);
        this.downloadCSV(csvContent, 'analytics-data.csv');
    }

    convertToCSV(data, headers) {
        const csvRows = [];
        csvRows.push(headers.join(','));
        
        data.forEach(item => {
            const row = headers.map(header => {
                const value = item[header] || '';
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvRows.push(row.join(','));
        });
        
        return csvRows.join('\n');
    }

    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    // Modal and form functions
    openModal(supplement = null) {
        this.editingId = supplement ? supplement.id : null;
        const modal = document.getElementById('supplementModal');
        const form = document.getElementById('supplementForm');
        const title = document.getElementById('modalTitle');

        title.textContent = supplement ? 'Edit Supplement' : 'Add Supplement';
        
        if (supplement) {
            this.populateForm(supplement);
        } else {
            form.reset();
            document.getElementById('currentDosageGroup').style.display = 'none';
        }

        modal.classList.remove('hidden');
    }

    populateForm(supplement) {
        document.getElementById('supplementName').value = supplement.name;
        document.getElementById('supplementCategory').value = supplement.category;
        document.getElementById('supplementDosage').value = supplement.dosage || '';
        document.getElementById('supplementTiming').value = supplement.timing || '';
        document.getElementById('supplementCost').value = supplement.costPerMonth || '';
        document.getElementById('supplementPurpose').value = supplement.purpose || '';
        document.getElementById('supplementNotes').value = supplement.notes || '';
        document.getElementById('inCurrentStack').checked = supplement.inCurrentStack;
        document.getElementById('currentDosage').value = supplement.currentDosage || '';
        document.getElementById('currentDosageGroup').style.display = supplement.inCurrentStack ? 'block' : 'none';
    }

    closeModal() {
        document.getElementById('supplementModal').classList.add('hidden');
        this.editingId = null;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('supplementName').value.trim(),
            category: document.getElementById('supplementCategory').value,
            dosage: document.getElementById('supplementDosage').value.trim(),
            timing: document.getElementById('supplementTiming').value.trim(),
            costPerMonth: parseInt(document.getElementById('supplementCost').value) || 0,
            purpose: document.getElementById('supplementPurpose').value.trim(),
            notes: document.getElementById('supplementNotes').value.trim(),
            inCurrentStack: document.getElementById('inCurrentStack').checked,
            currentDosage: document.getElementById('currentDosage').value.trim(),
            roi: 'User added supplement',
            evidenceRating: 3
        };

        if (!formData.name || !formData.category) {
            alert('Name and Category are required fields.');
            return;
        }

        if (this.editingId) {
            this.updateSupplement(this.editingId, formData);
        } else {
            this.addSupplement(formData);
        }

        this.closeModal();
        this.renderLibrary();
        if (this.currentView === 'stack') {
            this.renderCurrentStack();
        }
        if (this.currentView === 'analytics') {
            this.renderAnalytics();
        }
        this.updateStackSummary();
    }

    addSupplement(data) {
        const newId = Math.max(...this.supplements.map(s => s.id), 0) + 1;
        this.supplements.push({ id: newId, ...data });
        this.filteredSupplements = [...this.supplements];
    }

    updateSupplement(id, data) {
        const index = this.supplements.findIndex(s => s.id === id);
        if (index !== -1) {
            this.supplements[index] = { id, ...data };
            this.filteredSupplements = [...this.supplements];
        }
    }

    editSupplement(id) {
        const supplement = this.supplements.find(s => s.id === id);
        if (supplement) {
            this.openModal(supplement);
        }
    }

    deleteSupplement(id) {
        const supplement = this.supplements.find(s => s.id === id);
        if (supplement && confirm(`Are you sure you want to delete "${supplement.name}"?`)) {
            this.supplements = this.supplements.filter(s => s.id !== id);
            this.filteredSupplements = [...this.supplements];
            this.renderLibrary();
            if (this.currentView === 'stack') {
                this.renderCurrentStack();
            }
            if (this.currentView === 'analytics') {
                this.renderAnalytics();
            }
            this.updateStackSummary();
        }
    }

    toggleStack(id) {
        const supplement = this.supplements.find(s => s.id === id);
        if (supplement) {
            supplement.inCurrentStack = !supplement.inCurrentStack;
            if (!supplement.inCurrentStack) {
                supplement.currentDosage = '';
            }
            this.renderLibrary();
            if (this.currentView === 'stack') {
                this.renderCurrentStack();
            }
            if (this.currentView === 'analytics') {
                this.renderAnalytics();
            }
            this.updateStackSummary();
        }
    }

    removeFromStack(id) {
        const supplement = this.supplements.find(s => s.id === id);
        if (supplement && confirm(`Remove "${supplement.name}" from your current stack?`)) {
            supplement.inCurrentStack = false;
            supplement.currentDosage = '';
            this.renderCurrentStack();
            this.renderLibrary();
            if (this.currentView === 'analytics') {
                this.renderAnalytics();
            }
            this.updateStackSummary();
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new SupplementArchive();
});