import React, { useState } from "react";
import "./AddChannel.css";
import Icons from "../../icons/Icon";
import apiService from "../../services/apiServices";

function AddChannel({ isOpen, onClose, serverId, onChannelCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "text",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Channel name is required";
    } else if (formData.name.trim().length < 1) {
      newErrors.name = "Channel name must be at least 1 character";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Channel name must be less than 100 characters";
    }

    if (!formData.type) {
      newErrors.type = "Channel type is required";
    }

    if (formData.description.length > 1024) {
      newErrors.description = "Description must be less than 1024 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!serverId) {
      setErrors({ submit: "No server selected" });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // API call happens here in the modal
      const newChannel = await apiService.createChannel(serverId, {
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim(),
      });

      console.log("Channel created successfully:", newChannel);

      // Reset form
      setFormData({ name: "", type: "text", description: "" });

      // Notify parent component about the new channel
      if (onChannelCreated) {
        onChannelCreated(newChannel);
      }

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error creating channel:", error);
      setErrors({
        submit: error.message || "Failed to create channel. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", type: "text", description: "" });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Channel</h3>
          <button className="modal-close" onClick={handleClose}>
            <Icons.Close />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Show general error */}
          {errors.submit && <div className="error-banner">{errors.submit}</div>}

          <div className="form-group">
            <label htmlFor="channelName">Channel Name *</label>
            <input
              type="text"
              id="channelName"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter channel name"
              className={errors.name ? "error" : ""}
              disabled={loading}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="channelType">Channel Type *</label>
            <select
              id="channelType"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={errors.type ? "error" : ""}
              disabled={loading}
            >
              <option value="text">📝 Text Channel</option>
              <option value="voice">🔊 Voice Channel</option>
            </select>
            {errors.type && <span className="error-text">{errors.type}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="channelDescription">Description (Optional)</label>
            <textarea
              id="channelDescription"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter channel description"
              rows={3}
              className={errors.description ? "error" : ""}
              disabled={loading}
            />
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-create" disabled={loading}>
              {loading ? "Creating..." : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddChannel;
