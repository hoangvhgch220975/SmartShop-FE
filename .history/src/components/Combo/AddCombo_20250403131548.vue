<template>
    <div class="add-combo container mt-5 mb-5">
      <h2 class="form-title text-success font-weight-bold mb-4 text-center">🎁 Add New Combo</h2>
  
      <form @submit.prevent="submitForm" class="shadow p-5 bg-white rounded-lg">
        <!-- Name -->
        <div class="form-group">
          <label for="name">Combo Name</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            class="form-control"
            required
          />
        </div>
  
        <!-- Description -->
        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="form.description"
            class="form-control"
            rows="3"
            required
          ></textarea>
        </div>
  
        <!-- Included Devices -->
        <div class="form-group">
          <label for="devices">Included Devices</label>
          <select
            id="devices"
            v-model="form.includedDevices"
            class="form-control custom-select"
            multiple
            size="4"
            required
          >
            <option disabled value="">-- Select Devices --</option>
            <option
              v-for="device in devices"
              :key="device._id"
              :value="device.name"
            >
              {{ device.name }}
            </option>
          </select>
        </div>
  
        <!-- Included Packages -->
        <div class="form-group">
          <label for="packages">Included Packages</label>
          <select
            id="packages"
            v-model="form.includedPackages"
            class="form-control custom-select"
            multiple
            size="4"
            required
          >
            <option disabled value="">-- Select Packages --</option>
            <option
              v-for="pkg in packages"
              :key="pkg._id"
              :value="pkg.name"
            >
              {{ pkg.name }}
            </option>
          </select>
        </div>
  
       <!-- Price -->
      <div class="form-group">
        <label for="price">Price ($)</label>
        <input
          type="text"
          id="price"
          v-model="form.price"
          class="form-control"
          required
          pattern="^\d+(\.\d{1,2})?$"
          placeholder="e.g. 299.99"
        />
      </div>
  
        <!-- Stock -->
        <div class="form-group">
          <label for="stock">Stock</label>
          <input
            type="number"
            id="stock"
            v-model.number="form.stock"
            class="form-control"
            required
          />
        </div>
        
        <!-- Image (URL or filename) -->
      <div class="form-group">
        <label for="image">Image (URL or filename)</label>
        <input
          type="text"
          id="image"
          v-model="form.image"
          class="form-control"
        />
      </div>

        <!-- Image Upload -->
        <div class="form-group">
          <label for="image">Image File</label>
          <input
            type="file"
            id="image"
            @change="handleFileUpload"
            class="form-control"
            accept="image/*"
          />
        </div>
  
        <!-- Image Preview -->
        <img
          v-if="form.image && isLocalImage(form.image)"
          :src="`http://localhost:3333/uploads/${form.image}`"
          class="img-thumbnail mt-3"
          style="max-width: 200px"
        />
        <img
          v-else-if="form.image"
          :src="form.image"
          class="img-thumbnail mt-3"
          style="max-width: 200px"
        />
  
        <!-- Buttons -->
        <div class="d-flex justify-content-end mt-4">
          <button type="submit" class="btn btn-success btn-lg mr-3 shadow-sm">
            💾 Save
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary btn-lg shadow-sm"
            @click="$router.back()"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "AddCombo",
    data() {
      return {
        form: {
          name: "",
          description: "",
          includedDevices: [],
          includedPackages: [],
          price: "",
          stock: null,
          image: "",
        },
        devices: [],
        packages: [],
      };
    },
    methods: {
      async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return; 
  
        const formData = new FormData();
        formData.append("image", file);
  
        try {
            const res = await fetch("http://localhost:3333/api/upload", {
                method: "POST",
                body: formData,});
            const data = await res.json();
            this.form.image = data.filename; // Assuming the server returns the filename
          alert("✅ Image uploaded successfully!");
        } catch (err) {
          alert("❌ Upload failed: " + err.message);
        }
      },
      isLocalImage(filename) {
        return filename && !filename.startsWith("http");
      },
      async fetchOptions() {
        try {
          const [devicesRes, packagesRes] = await Promise.all([
            axios.get("http://localhost:3333/devices"),
            axios.get("http://localhost:3333/packages"),
          ]);
          this.devices = devicesRes.data;
          this.packages = packagesRes.data;
        } catch (err) {
          console.error("Error loading devices/packages:", err);
        }
      },
      async submitForm() {
        if (!/^\d+(\.\d{1,2})?$/.test(this.form.price)) {
          alert("⚠️ Please enter a valid price (e.g., 299.99)");
          return;
        }
  
        try {
          await axios.post("http://localhost:3333/combos", this.form);
          alert("✅ Combo added successfully!");
          this.$router.push("/admin/combos");
        } catch (err) {
          alert("❌ Failed to add combo: " + (err.message || "Unknown error"));
        }
      },
    },
    mounted() {
      this.fetchOptions();
    },
  };
  </script>
  
  <style scoped>
  .add-combo {
    max-width: 720px;
  }
  
  .form-title {
    font-size: 1.8rem;
    text-shadow: 1px 1px 2px #ccc;
  }
  
  .form-control {
    border-radius: 0.5rem;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  
  .form-control:focus {
    border-color: #28a745;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
  }
  
  select.form-control {
    appearance: none;
    min-height: 100px;
  }
  
  select.form-control[multiple] {
    overflow-y: auto;
    padding: 8px;
    font-size: 1rem;
  }
  
  .img-thumbnail {
    border-radius: 0.5rem;
    max-height: 200px;
    object-fit: contain;
  }
  
  .btn {
    min-width: 120px;
    border-radius: 1.5rem;
  }
  
  .btn-success:hover {
    background-color: #218838;
  }
  
  .btn-outline-secondary:hover {
    background-color: #e2e6ea;
  }
  </style>
  