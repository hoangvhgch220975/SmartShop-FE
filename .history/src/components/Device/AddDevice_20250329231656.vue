<template>
  <div class="add-device container mt-5 mb-5">
    <h2 class="form-title text-success font-weight-bold mb-4 text-center">➕ Add New Device</h2>

    <form @submit.prevent="submitForm" class="shadow p-5 bg-white rounded-lg">
      <!-- Name -->
      <div class="form-group position-relative">
        <label for="name">Device Name</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          class="form-control input-icon"
          required
        />
      </div>

      <!-- Category -->
      <div class="form-group">
        <label for="category">Category</label>
        <select
          id="category"
          v-model="form.category"
          class="form-control custom-select"
          required
        >
          <option disabled value="">-- Select Category --</option>
          <option value="Laptop">💻 Laptop</option>
          <option value="Phone">📱 Phone</option>
          <option value="Tablet">📟 Tablet</option>
        </select>
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

      <!-- Optional File Upload -->
      <div class="form-group">
        <label for="imageFile">Or Upload Image</label>
        <input
          type="file"
          id="imageFile"
          @change="handleFileUpload"
          class="form-control"
          accept="image/*"
        />
      </div>

      <!-- Image Preview -->
      <img
        v-if="form.image && isLocalImage(form.image)"
        :src="`http://localhost:3333/uploads/${form.image}`"
        alt="Device"
        class="img-thumbnail mt-3"
        style="max-width: 200px"
      />
      <img
        v-else-if="form.image"
        :src="form.image"
        alt="Device"
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
import { addDevice, getAllDevices } from "@/api/DeviceAPI";

export default {
  name: "AddDevice",
  data() {
    return {
      form: {
        name: "",
        category: "",
        description: "",
        price: "",
        stock: null,
        image: "",
      },
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
          body: formData,
        });
        const data = await res.json();
        this.form.image = data.filename;
        alert("✅ Image uploaded successfully!");
      } catch (err) {
        alert("❌ Upload failed: " + err.message);
      }
    },

    isLocalImage(filename) {
      return !filename.startsWith("http");
    },

    async submitForm() {
      try {
        const existing = await getAllDevices();
        const nameExists = existing.data.some(
          (device) =>
            device.name.trim().toLowerCase() === this.form.name.trim().toLowerCase()
        );

        if (nameExists) {
          alert("⚠️ A device with this name already exists.");
          return;
        }

        if (!/^\d+(\.\d{1,2})?$/.test(this.form.price)) {
          alert("⚠️ Please enter a valid price (e.g., 299.99)");
          return;
        }

        await addDevice(this.form);
        alert("✅ Device added successfully!");
        this.$router.push("/admin/devices");
      } catch (err) {
        alert("❌ Failed to add device: " + (err.message || "Unknown error"));
      }
    },
  },
};
</script>

<style scoped>
.add-device {
  max-width: 720px;
}

.form-title {
  font-size: 1.8rem;
  text-shadow: 1px 1px 2px #ccc;
}

.form-control {
  transition: border-color 0.3s, box-shadow 0.3s;
  border-radius: 0.5rem;
}

.form-control:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

select.form-control {
  appearance: none;
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

.shadow-sm {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
</style>
