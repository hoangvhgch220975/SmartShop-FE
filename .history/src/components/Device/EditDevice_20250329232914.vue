<template>
  <div class="edit-device container mt-5 mb-5">
    <h2 class="text-primary font-weight-bold mb-4 text-center">✏️ Edit Device</h2>

    <form v-if="device" @submit.prevent="submitForm" class="shadow p-5 bg-white rounded-lg">
      <!-- Name -->
      <div class="form-group">
        <label for="name">Device Name</label>
        <input
          type="text"
          id="name"
          v-model="device.name"
          class="form-control"
          required
        />
      </div>

      <!-- Category -->
      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" v-model="device.category" class="form-control" required>
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
          v-model="device.description"
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
          v-model="device.price"
          class="form-control"
          required
          placeholder="e.g. 199.99"
          pattern="^\d+(\.\d{1,2})?$"
        />
      </div>

      <!-- Stock -->
      <div class="form-group">
        <label for="stock">Stock</label>
        <input
          type="number"
          id="stock"
          v-model.number="device.stock"
          class="form-control"
          required
        />
      </div>

      <!-- Image (manual entry) -->
      <div class="form-group">
        <label for="image">Image (URL or filename)</label>
        <input
          type="text"
          id="image"
          v-model="device.image"
          class="form-control"
        />
      </div>

      <!-- File Upload -->
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
        v-if="device.image && isLocalImage(device.image)"
        :src="`http://localhost:3333/uploads/${device.image}`"
        class="img-thumbnail mt-3"
        style="max-width: 200px"
        alt="Preview"
      />
      <img
        v-else-if="device.image"
        :src="device.image"
        class="img-thumbnail mt-3"
        style="max-width: 200px"
        alt="Preview"
      />

      <!-- Buttons -->
      <div class="d-flex justify-content-end mt-4">
        <button type="submit" class="btn btn-primary btn-lg mr-3 shadow-sm">
          💾 Update
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

    <div v-else class="text-center py-5 text-muted">Loading device info...</div>
  </div>
</template>

<script>
import { getDeviceById, updateDevice } from "@/api/DeviceAPI";

export default {
  name: "EditDevice",
  data() {
    return {
      device: null,
      error: null,
    };
  },
  methods: {
    async fetchDevice() {
      const id = this.$route.params.id;
      try {
        const response = await getDeviceById(id);
        this.device = response.data;
      } catch (err) {
        this.error = err.message || "Device not found.";
        alert("❌ Error: " + this.error);
        this.$router.back();
      }
    },

    async submitForm() {
      if (!/^\d+(\.\d{1,2})?$/.test(this.device.price)) {
        alert("⚠️ Please enter a valid price like 199.99");
        return;
      }

      try {
        await updateDevice(this.device._id, this.device);
        alert("✅ Device updated successfully!");
        this.$router.push("/admin/devices");
      } catch (err) {
        alert("❌ Update failed: " + (err.message || "Unknown error"));
      }
    },

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
        this.device.image = data.filename;
        alert("✅ Image uploaded!");
      } catch (err) {
        alert("❌ Upload failed: " + err.message);
      }
    },

    isLocalImage(filename) {
      return filename && !filename.startsWith("http");
    },
  },
  mounted() {
    this.fetchDevice();
  },
};
</script>

<style scoped>
.edit-device {
  max-width: 720px;
}

form {
  border-radius: 16px;
  transition: box-shadow 0.3s ease;
}

form:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.form-control {
  border-radius: 0.5rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn {
  min-width: 120px;
  border-radius: 1.5rem;
}

.btn-primary:hover {
  background-color: #0069d9;
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa;
}

.img-thumbnail {
  max-width: 200px;
  object-fit: cover;
  border-radius: 10px;
}
</style>
