// Alert.js
export default class Alert {
  constructor(alertJsonPath, rotationInterval = 5000) {
    this.alertJsonPath = alertJsonPath;
    this.alertContainer = document.querySelector('.alert-banner');
    this.rotationInterval = rotationInterval;
    this.alerts = [];
    this.currentIndex = 0;
    this.intervalId = null;
  }

  async loadAndDisplayAlerts() {
    try {
      const res = await fetch(this.alertJsonPath);
      if (!res.ok) throw new Error('No se pudo cargar alerts.json');

      this.alerts = await res.json();

      if (!this.alerts.length) return; // No hay alertas

      this.showAlert(this.alerts[this.currentIndex]);

      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.alerts.length;
        this.showAlert(this.alerts[this.currentIndex]);
      }, this.rotationInterval);
    } catch (err) {
      console.error('Error al mostrar alertas:', err);
    }
  }

  showAlert(alert) {
    this.alertContainer.innerHTML = `
      <div style="
        background-color: ${alert.background};
        color: ${alert.color};
        padding: 1em;
        text-align: center;
        font-weight: bold;
      ">
        ${alert.message}
      </div>
    `;
  }
}
