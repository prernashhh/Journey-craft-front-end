import { X, CreditCard, Calendar, Lock } from "lucide-react";
import "./PaymentModal.css";

function PaymentModal({ event, onClose, onSuccess }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically integrate with a real payment gateway
    // For now, we'll simulate a successful payment
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1500);
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal-content">
        <button className="modal-close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="payment-details">
          <h2>Complete Your Booking</h2>
          
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Event</span>
                <span>{event.title}</span>
              </div>
              <div className="summary-row">
                <span>Date</span>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="summary-row">
                <span>Price</span>
                <span>₹{event.price.amount}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{event.price.amount}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label>Card Number</label>
              <div className="input-with-icon">
                <CreditCard size={18} />
                <input 
                  type="text" 
                  placeholder="1234 5678 9012 3456"
                  pattern="[0-9\s]{13,19}"
                  maxLength="19"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <div className="input-with-icon">
                  <Calendar size={18} />
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                    maxLength="5"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>CVV</label>
                <div className="input-with-icon">
                  <Lock size={18} />
                  <input 
                    type="text" 
                    placeholder="123"
                    pattern="[0-9]{3,4}"
                    maxLength="4"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Card Holder Name</label>
              <input 
                type="text" 
                placeholder="Name on card"
                required
              />
            </div>

            <button type="submit" className="pay-button">
              Pay ₹{event.price.amount}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;