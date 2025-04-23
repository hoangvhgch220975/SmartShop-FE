<template>
    <div class="search-results">
        <h1>Search Results for: "{{ searchQuery }}"</h1>

        <div v-if="isLoading" class="loading-message">Loading...</div>

        <div v-else>
            <section v-if="devices.length || packages.length || combos.length">

                <!-- Display devices -->
                <div v-if="devices.length" class="search-section">
                    <h2>Devices</h2>
                    <div class="result-list">
                        <div v-for="device in devices" :key="device._id" class="result-item">
                            <router-link :to="`/device/${device._id}`">
                                <img :src="getImageSrc(device.image, 'device')" alt="Device" />
                                <p v-html="highlightText(device.name)"></p>
                            </router-link>
                        </div>
                    </div>
                </div>

                <!-- Display packages -->
                <div v-if="packages.length" class="search-section">
                    <h2>Packages</h2>
                    <div class="result-list">
                        <div v-for="pkg in packages" :key="pkg._id" class="result-item">
                            <router-link :to="`/package/${pkg._id}`">
                                <img :src="getImageSrc(pkg.image, 'package')" alt="Package" />
                                <p v-html="highlightText(pkg.name)"></p>
                            </router-link>
                        </div>
                    </div>
                </div>

                <!-- Display combos -->
                <div v-if="combos.length" class="search-section">
                    <h2>Combos</h2>
                    <div class="result-list">
                        <div v-for="combo in combos" :key="combo._id" class="result-item">
                            <router-link :to="`/combo/${combo._id}`">
                                <img :src="getImageSrc(combo.image, 'combo')" alt="Combo" />
                                <p v-html="highlightText(combo.name)"></p>
                                <div v-if="combo.devices && combo.devices.length">
                                    <p>Includes Devices:</p>
                                    <ul>
                                        <li v-for="device in combo.devices" :key="device._id">
                                            <router-link :to="`/device/${device._id}`">{{ device.name }}</router-link>
                                        </li>
                                    </ul>
                                </div>
                                <div v-if="combo.packages && combo.packages.length">
                                    <p>Includes Packages:</p>
                                    <ul>
                                        <li v-for="pkg in combo.packages" :key="pkg._id">
                                            <router-link :to="`/package/${pkg._id}`">{{ pkg.name }}</router-link>
                                        </li>
                                    </ul>
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </section>

            <div v-else>
                <p>No results found. Try another keyword.</p>
            </div>
        </div>
    </div>
</template>

<script>
import { searchDevicesByName } from '@/api/DeviceAPI';
import { searchPackagesByName } from '@/api/PackageAPI';
import { searchCombosByName } from '@/api/ComboAPI';
import { debounce } from 'lodash';

export default {
    name: 'SearchResult',
    data() {
        return {
            searchQuery: this.$route.query.q || '', // Get search query from URL
            devices: [],
            packages: [],
            combos: [],
            isLoading: false,
        };
    },
    watch: {
        // Watch for changes to the search query in the route
        '$route.query.q': function (newQuery) {
            this.searchQuery = newQuery; // Update local searchQuery when the URL query changes
            this.debouncedFetchSearchResults(); // Trigger search whenever the query changes
        },
    },
    created() {
        if (this.searchQuery) {
            this.fetchSearchResults();
        }
    },
    methods: {
        // Debounced method for fetching search results
        debouncedFetchSearchResults: debounce(async function () {
            await this.fetchSearchResults();
        }, 500), // Delay of 500ms after the user stops typing

        // Method to fetch the search results from the API
        async fetchSearchResults() {
            try {
                this.isLoading = true;

                const [deviceResponse, packageResponse, comboResponse] = await Promise.all([
                    searchDevicesByName(this.searchQuery),
                    searchPackagesByName(this.searchQuery),
                    searchCombosByName(this.searchQuery),
                ]);

                this.devices = deviceResponse.data || [];
                this.packages = packageResponse.data || [];
                this.combos = comboResponse.data || [];
            } catch (error) {
                console.error('Error fetching search results:', error);
            } finally {
                this.isLoading = false;
            }
        },

        // General method to fetch the image source based on the category
        getImageSrc(imagePath, category = 'default') {
            if (!imagePath) return '';
            if (imagePath.startsWith('http')) return imagePath;

            // Use different folders based on the category (combo, device, package)
            const folderMap = {
                combo: 'imagecombo',
                device: 'imagedevice',
                package: 'imagepackage',
            };

            const folder = folderMap[category] || 'imagecombo'; // Default to imagecombo if no category is specified
            try {
                return require(`@/assets/${folder}/${imagePath}`);
            } catch {
                return `https://smartshop-be.onrender.com/uploads/${imagePath}`;
            }
        },

        // Method to highlight the search keyword in text
        highlightText(text) {
            if (!text || !this.searchQuery) return text;
            const regex = new RegExp(`(${this.searchQuery})`, 'gi');
            return text.replace(regex, '<span class="highlight">$1</span>');
        },
    },
};
</script>

<style scoped>
.search-results {
    padding: 20px;
    font-family: Arial, sans-serif;
    padding-top: 100px;
}

.loading-message {
    font-size: 1.5rem;
    text-align: center;
    color: #007bff;
}

.search-section {
    margin-bottom: 30px;
}

.search-section h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #333;
}

.result-list {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.result-item {
    width: 220px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.result-item:hover {
    transform: scale(1.05);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

.result-item img {
    width: 100%;
    height: 180px;
    object-fit: fill;
    margin-bottom: 10px;
    border-radius: 8px;
}

.result-item p {
    font-size: 16px;
    color: #333;
    font-weight: 500;
    margin-top: 5px;
}

.highlight {
    background-color: yellow;
    font-weight: bold;
}

@media (max-width: 768px) {
    .result-item {
        width: 48%;
    }
}

@media (max-width: 480px) {
    .result-item {
        width: 100%;
    }
}
</style>