import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/DevOpsCalculator.css'

function DevOpsCalculator() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('server')

  // Server Cost Calculator
  const [serverSpecs, setServerSpecs] = useState({
    cpu: 2,
    ram: 4,
    storage: 100,
    bandwidth: 1,
    quantity: 1,
    pricePerCore: 0.05,
    pricePerGB: 0.01,
    pricePerTB: 0.09
  })

  // Bandwidth Calculator
  const [bandwidth, setBandwidth] = useState({
    requestsPerDay: 10000,
    avgResponseSize: 500,
    peakMultiplier: 3
  })

  // Uptime Calculator
  const [uptime, setUptime] = useState({
    availability: 99.9
  })

  // Container Calculator
  const [containers, setContainers] = useState({
    replicas: 3,
    cpuPerPod: 0.5,
    ramPerPod: 512,
    pods: 10
  })

  const calculateServerCost = () => {
    const cpuCost = serverSpecs.cpu * serverSpecs.pricePerCore * 730 // hours per month
    const ramCost = serverSpecs.ram * serverSpecs.pricePerGB * 730
    const storageCost = serverSpecs.storage * serverSpecs.pricePerTB / 1000 * 730
    const bandwidthCost = serverSpecs.bandwidth * serverSpecs.pricePerTB * 730
    const totalPerServer = cpuCost + ramCost + storageCost + bandwidthCost
    const totalCost = totalPerServer * serverSpecs.quantity

    return {
      cpuCost: (cpuCost * serverSpecs.quantity).toFixed(2),
      ramCost: (ramCost * serverSpecs.quantity).toFixed(2),
      storageCost: (storageCost * serverSpecs.quantity).toFixed(2),
      bandwidthCost: (bandwidthCost * serverSpecs.quantity).toFixed(2),
      perServer: totalPerServer.toFixed(2),
      monthly: totalCost.toFixed(2),
      yearly: (totalCost * 12).toFixed(2)
    }
  }

  const calculateBandwidth = () => {
    const bytesPerDay = bandwidth.requestsPerDay * bandwidth.avgResponseSize
    const gbPerDay = bytesPerDay / (1024 * 1024 * 1024)
    const gbPerMonth = gbPerDay * 30
    const peakGbPerDay = gbPerDay * bandwidth.peakMultiplier

    return {
      gbPerDay: gbPerDay.toFixed(2),
      gbPerMonth: gbPerMonth.toFixed(2),
      peakGbPerDay: peakGbPerDay.toFixed(2),
      estimatedCost: (gbPerMonth * 0.09).toFixed(2) // $0.09 per GB
    }
  }

  const calculateUptime = () => {
    const downtime = 100 - uptime.availability
    const minutesPerMonth = 43200 // 30 days
    const downtimeMinutes = (minutesPerMonth * downtime) / 100
    const downtimeHours = downtimeMinutes / 60

    return {
      monthlyDowntime: downtimeMinutes.toFixed(2),
      monthlyDowntimeHours: downtimeHours.toFixed(2),
      yearlyDowntime: (downtimeMinutes * 12).toFixed(2),
      yearlyDowntimeHours: (downtimeHours * 12).toFixed(2)
    }
  }

  const calculateContainers = () => {
    const totalPods = containers.pods * containers.replicas
    const totalCpu = totalPods * containers.cpuPerPod
    const totalRam = totalPods * containers.ramPerPod / 1024 // Convert to GB

    return {
      totalPods,
      totalCpu: totalCpu.toFixed(2),
      totalRam: totalRam.toFixed(2),
      estimatedCost: (totalCpu * 0.05 * 730 + totalRam * 0.01 * 730).toFixed(2)
    }
  }

  const serverCosts = calculateServerCost()
  const bandwidthStats = calculateBandwidth()
  const uptimeStats = calculateUptime()
  const containerStats = calculateContainers()

  return (
    <div className="devops-calculator">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="calculator-container">
        <h1>DevOps Calculator</h1>
        <p className="subtitle">Calculate server costs, bandwidth, uptime, and container resources</p>

        <div className="tabs">
          <button
            className={activeTab === 'server' ? 'active' : ''}
            onClick={() => setActiveTab('server')}
          >
            Server Costs
          </button>
          <button
            className={activeTab === 'bandwidth' ? 'active' : ''}
            onClick={() => setActiveTab('bandwidth')}
          >
            Bandwidth
          </button>
          <button
            className={activeTab === 'uptime' ? 'active' : ''}
            onClick={() => setActiveTab('uptime')}
          >
            Uptime
          </button>
          <button
            className={activeTab === 'containers' ? 'active' : ''}
            onClick={() => setActiveTab('containers')}
          >
            Containers
          </button>
        </div>

        {activeTab === 'server' && (
          <div className="tab-content">
            <h2>Server Cost Calculator</h2>
            <div className="input-grid">
              <div className="input-group">
                <label>CPU Cores: {serverSpecs.cpu}</label>
                <input
                  type="range"
                  min="1"
                  max="64"
                  value={serverSpecs.cpu}
                  onChange={(e) => setServerSpecs({...serverSpecs, cpu: parseInt(e.target.value)})}
                />
              </div>
              <div className="input-group">
                <label>RAM (GB): {serverSpecs.ram}</label>
                <input
                  type="range"
                  min="1"
                  max="256"
                  value={serverSpecs.ram}
                  onChange={(e) => setServerSpecs({...serverSpecs, ram: parseInt(e.target.value)})}
                />
              </div>
              <div className="input-group">
                <label>Storage (GB): {serverSpecs.storage}</label>
                <input
                  type="range"
                  min="10"
                  max="10000"
                  step="10"
                  value={serverSpecs.storage}
                  onChange={(e) => setServerSpecs({...serverSpecs, storage: parseInt(e.target.value)})}
                />
              </div>
              <div className="input-group">
                <label>Bandwidth (TB): {serverSpecs.bandwidth}</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={serverSpecs.bandwidth}
                  onChange={(e) => setServerSpecs({...serverSpecs, bandwidth: parseInt(e.target.value)})}
                />
              </div>
              <div className="input-group">
                <label>Server Quantity: {serverSpecs.quantity}</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={serverSpecs.quantity}
                  onChange={(e) => setServerSpecs({...serverSpecs, quantity: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="results-section">
              <h3>Cost Breakdown</h3>
              <div className="results-grid">
                <div className="result-item">
                  <span className="label">CPU Cost/Month:</span>
                  <span className="value">${serverCosts.cpuCost}</span>
                </div>
                <div className="result-item">
                  <span className="label">RAM Cost/Month:</span>
                  <span className="value">${serverCosts.ramCost}</span>
                </div>
                <div className="result-item">
                  <span className="label">Storage Cost/Month:</span>
                  <span className="value">${serverCosts.storageCost}</span>
                </div>
                <div className="result-item">
                  <span className="label">Bandwidth Cost/Month:</span>
                  <span className="value">${serverCosts.bandwidthCost}</span>
                </div>
                <div className="result-item highlight">
                  <span className="label">Monthly Total:</span>
                  <span className="value">${serverCosts.monthly}</span>
                </div>
                <div className="result-item highlight">
                  <span className="label">Yearly Total:</span>
                  <span className="value">${serverCosts.yearly}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bandwidth' && (
          <div className="tab-content">
            <h2>Bandwidth Calculator</h2>
            <div className="input-grid">
              <div className="input-group">
                <label>Requests Per Day:</label>
                <input
                  type="number"
                  value={bandwidth.requestsPerDay}
                  onChange={(e) => setBandwidth({...bandwidth, requestsPerDay: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="input-group">
                <label>Avg Response Size (KB):</label>
                <input
                  type="number"
                  value={bandwidth.avgResponseSize}
                  onChange={(e) => setBandwidth({...bandwidth, avgResponseSize: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="input-group">
                <label>Peak Traffic Multiplier: {bandwidth.peakMultiplier}x</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={bandwidth.peakMultiplier}
                  onChange={(e) => setBandwidth({...bandwidth, peakMultiplier: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div className="results-section">
              <h3>Bandwidth Usage</h3>
              <div className="results-grid">
                <div className="result-item">
                  <span className="label">GB Per Day:</span>
                  <span className="value">{bandwidthStats.gbPerDay}</span>
                </div>
                <div className="result-item">
                  <span className="label">GB Per Month:</span>
                  <span className="value">{bandwidthStats.gbPerMonth}</span>
                </div>
                <div className="result-item">
                  <span className="label">Peak GB Per Day:</span>
                  <span className="value">{bandwidthStats.peakGbPerDay}</span>
                </div>
                <div className="result-item highlight">
                  <span className="label">Estimated Cost/Month:</span>
                  <span className="value">${bandwidthStats.estimatedCost}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'uptime' && (
          <div className="tab-content">
            <h2>Uptime Calculator</h2>
            <div className="input-grid">
              <div className="input-group">
                <label>Target Availability: {uptime.availability}%</label>
                <input
                  type="range"
                  min="90"
                  max="99.999"
                  step="0.001"
                  value={uptime.availability}
                  onChange={(e) => setUptime({availability: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <div className="results-section">
              <h3>Allowed Downtime</h3>
              <div className="results-grid">
                <div className="result-item">
                  <span className="label">Monthly Downtime (minutes):</span>
                  <span className="value">{uptimeStats.monthlyDowntime}</span>
                </div>
                <div className="result-item">
                  <span className="label">Monthly Downtime (hours):</span>
                  <span className="value">{uptimeStats.monthlyDowntimeHours}</span>
                </div>
                <div className="result-item">
                  <span className="label">Yearly Downtime (minutes):</span>
                  <span className="value">{uptimeStats.yearlyDowntime}</span>
                </div>
                <div className="result-item">
                  <span className="label">Yearly Downtime (hours):</span>
                  <span className="value">{uptimeStats.yearlyDowntimeHours}</span>
                </div>
              </div>

              <div className="sla-guide">
                <h4>Common SLA Levels</h4>
                <ul>
                  <li>99% = 7.2 hours downtime/month</li>
                  <li>99.9% = 43.2 minutes downtime/month</li>
                  <li>99.99% = 4.32 minutes downtime/month</li>
                  <li>99.999% = 25.9 seconds downtime/month</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'containers' && (
          <div className="tab-content">
            <h2>Container Resource Calculator</h2>
            <div className="input-grid">
              <div className="input-group">
                <label>Replicas Per Service: {containers.replicas}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={containers.replicas}
                  onChange={(e) => setContainers({...containers, replicas: parseInt(e.target.value)})}
                />
              </div>
              <div className="input-group">
                <label>CPU Per Pod: {containers.cpuPerPod}</label>
                <input
                  type="range"
                  min="0.1"
                  max="4"
                  step="0.1"
                  value={containers.cpuPerPod}
                  onChange={(e) => setContainers({...containers, cpuPerPod: parseFloat(e.target.value)})}
                />
              </div>
              <div className="input-group">
                <label>RAM Per Pod (MB): {containers.ramPerPod}</label>
                <input
                  type="range"
                  min="128"
                  max="8192"
                  step="128"
                  value={containers.ramPerPod}
                  onChange={(e) => setContainers({...containers, ramPerPod: parseInt(e.target.value)})}
                />
              </div>
              <div className="input-group">
                <label>Number of Services: {containers.pods}</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={containers.pods}
                  onChange={(e) => setContainers({...containers, pods: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="results-section">
              <h3>Total Resources</h3>
              <div className="results-grid">
                <div className="result-item">
                  <span className="label">Total Pods:</span>
                  <span className="value">{containerStats.totalPods}</span>
                </div>
                <div className="result-item">
                  <span className="label">Total CPU Cores:</span>
                  <span className="value">{containerStats.totalCpu}</span>
                </div>
                <div className="result-item">
                  <span className="label">Total RAM (GB):</span>
                  <span className="value">{containerStats.totalRam}</span>
                </div>
                <div className="result-item highlight">
                  <span className="label">Estimated Cost/Month:</span>
                  <span className="value">${containerStats.estimatedCost}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DevOpsCalculator
