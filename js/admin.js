// Admin Authentication
const loginForm = document.getElementById('login-form');
const loginScreen = document.getElementById('login-screen');
const adminPanel = document.getElementById('admin-panel');

// Check if user is already logged in
auth.onAuthStateChanged(user => {
    if (user) {
        loginScreen.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        loadDashboard();
    }
});

// Login Function
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log('Logged in successfully');
        })
        .catch(error => {
            alert('Login failed: ' + error.message);
        });
});

// Logout Function
document.getElementById('logout-btn').addEventListener('click', () => {
    auth.signOut().then(() => {
        adminPanel.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    });
});

// Admin Navigation
document.querySelectorAll('.admin-nav').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('href').substring(1);
        loadSection(section);
        
        // Update active state
        document.querySelectorAll('.admin-nav').forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
    });
});

// Load Sections
function loadSection(section) {
    const contentArea = document.getElementById('content-area');
    
    switch(section) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'services':
            loadServicesManagement();
            break;
        case 'testimonials':
            loadTestimonialsManagement();
            break;
        case 'partners':
            loadPartnersManagement();
            break;
        case 'blog':
            loadBlogManagement();
            break;
        case 'contacts':
            loadContactsManagement();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'ads':
            loadAdManagement();
            break;
    }
}

// Dashboard
function loadDashboard() {
    const contentArea = document.getElementById('content-area');
    
    // Get stats from Firebase
    const contactsRef = database.ref('contacts');
    const testimonialsRef = database.ref('testimonials');
    const visitorsRef = database.ref('analytics/visitors');
    
    Promise.all([
        contactsRef.once('value'),
        testimonialsRef.once('value'),
        visitorsRef.once('value')
    ]).then(([contactsSnap, testimonialsSnap, visitorsSnap]) => {
        const contactsCount = contactsSnap.numChildren();
        const testimonialsCount = testimonialsSnap.numChildren();
        const visitorsCount = visitorsSnap.val() || 0;
        
        contentArea.innerHTML = `
            <h1 class="text-3xl font-bold mb-8">Dashboard</h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="text-2xl font-bold">${visitorsCount}</div>
                            <div class="text-gray-500">Total Visitors</div>
                        </div>
                        <i class="fas fa-users text-3xl text-primary-600"></i>
                    </div>
                </div>
                <div class="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="text-2xl font-bold">${contactsCount}</div>
                            <div class="text-gray-500">Contact Requests</div>
                        </div>
                        <i class="fas fa-envelope text-3xl text-green-600"></i>
                    </div>
                </div>
                <div class="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="text-2xl font-bold">${testimonialsCount}</div>
                            <div class="text-gray-500">Testimonials</div>
                        </div>
                        <i class="fas fa-star text-3xl text-yellow-600"></i>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <h3 class="text-xl font-bold mb-4">Recent Contacts</h3>
                    <div id="recent-contacts"></div>
                </div>
                <div class="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <h3 class="text-xl font-bold mb-4">Quick Actions</h3>
                    <div class="space-y-3">
                        <button onclick="loadServicesManagement()" class="w-full text-left p-3 bg-primary-50 dark:bg-dark-700 rounded-lg hover:bg-primary-100">
                            <i class="fas fa-plus mr-2"></i> Add New Service
                        </button>
                        <button onclick="loadTestimonialsManagement()" class="w-full text-left p-3 bg-primary-50 dark:bg-dark-700 rounded-lg hover:bg-primary-100">
                            <i class="fas fa-star mr-2"></i> Add Testimonial
                        </button>
                        <button onclick="loadBlogManagement()" class="w-full text-left p-3 bg-primary-50 dark:bg-dark-700 rounded-lg hover:bg-primary-100">
                            <i class="fas fa-blog mr-2"></i> Write Blog Post
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Load recent contacts
        loadRecentContacts();
    });
}

// Services Management
function loadServicesManagement() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <h1 class="text-3xl font-bold mb-8">Manage Services</h1>
        
        <div class="mb-8">
            <button onclick="showAddServiceForm()" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium">
                <i class="fas fa-plus mr-2"></i> Add New Service
            </button>
        </div>
        
        <div id="services-list" class="space-y-4"></div>
        
        <!-- Add Service Modal -->
        <div id="add-service-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
            <div class="bg-white dark:bg-dark-800 p-8 rounded-xl max-w-2xl w-full mx-4">
                <h3 class="text-xl font-bold mb-6">Add/Edit Service</h3>
                <form id="service-form" class="space-y-4">
                    <input type="hidden" id="service-id">
                    <div>
                        <label class="block text-sm font-medium mb-2">Service Name</label>
                        <input type="text" id="service-name" required 
                               class="w-full px-4 py-2 rounded-lg border dark:bg-dark-700">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Description</label>
                        <textarea id="service-description" rows="3" required 
                                  class="w-full px-4 py-2 rounded-lg border dark:bg-dark-700"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Price (₹)</label>
                        <input type="text" id="service-price" required 
                               class="w-full px-4 py-2 rounded-lg border dark:bg-dark-700">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Icon Class (FontAwesome)</label>
                        <input type="text" id="service-icon" placeholder="fas fa-bolt" 
                               class="w-full px-4 py-2 rounded-lg border dark:bg-dark-700">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Image URL</label>
                        <input type="text" id="service-image" 
                               class="w-full px-4 py-2 rounded-lg border dark:bg-dark-700">
                    </div>
                    <div class="flex justify-end space-x-4 pt-4">
                        <button type="button" onclick="hideAddServiceForm()" 
                                class="px-6 py-2 border rounded-lg">Cancel</button>
                        <button type="submit" 
                                class="px-6 py-2 bg-primary-600 text-white rounded-lg">Save Service</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    loadServicesList();
}

function loadServicesList() {
    const servicesRef = database.ref('services');
    servicesRef.on('value', (snapshot) => {
        const services = snapshot.val();
        const container = document.getElementById('services-list');
        container.innerHTML = '';
        
        if (services) {
            Object.entries(services).forEach(([id, service]) => {
                const serviceHTML = `
                    <div class="bg-white dark:bg-dark-800 p-6 rounded-xl shadow flex justify-between items-center">
                        <div>
                            <h4 class="font-bold text-lg">${service.name}</h4>
                            <p class="text-gray-600 dark:text-gray-400">${service.description.substring(0, 100)}...</p>
                            <div class="mt-2">
                                <span class="text-primary-600 font-bold">${service.price}</span>
                            </div>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="editService('${id}')" 
                                    class="px-4 py-2 bg-blue-600 text-white rounded-lg">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteService('${id}')" 
                                    class="px-4 py-2 bg-red-600 text-white rounded-lg">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                container.innerHTML += serviceHTML;
            });
        }
    });
}

function showAddServiceForm(serviceId = null) {
    const modal = document.getElementById('add-service-modal');
    const form = document.getElementById('service-form');
    const serviceIdInput = document.getElementById('service-id');
    
    if (serviceId) {
        // Load existing service data
        const serviceRef = database.ref('services/' + serviceId);
        serviceRef.once('value').then(snapshot => {
            const service = snapshot.val();
            document.getElementById('service-name').value = service.name;
            document.getElementById('service-description').value = service.description;
            document.getElementById('service-price').value = service.price;
            document.getElementById('service-icon').value = service.icon || '';
            document.getElementById('service-image').value = service.image || '';
            serviceIdInput.value = serviceId;
        });
    } else {
        form.reset();
        serviceIdInput.value = '';
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function hideAddServiceForm() {
    const modal = document.getElementById('add-service-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Add similar functions for testimonials, partners, blog, etc.

// Export Contacts to CSV
function exportContactsToCSV() {
    const contactsRef = database.ref('contacts');
    contactsRef.once('value').then(snapshot => {
        const contacts = snapshot.val();
        let csv = 'Name,Phone,Email,Service,Message,Date\n';
        
        Object.values(contacts).forEach(contact => {
            const date = new Date(contact.timestamp).toLocaleDateString();
            csv += `"${contact.name}","${contact.phone}","${contact.email}","${contact.service}","${contact.message}","${date}"\n`;
        });
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contacts.csv';
        a.click();
    });
}
