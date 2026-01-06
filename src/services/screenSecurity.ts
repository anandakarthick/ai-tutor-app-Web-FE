/**
 * Screen Security Service
 * Prevents screenshots, screen recording, and screen sharing on web
 */

type SecurityCallback = (isCapturing: boolean) => void;

class ScreenSecurityService {
  private isInitialized = false;
  private callbacks: SecurityCallback[] = [];
  private securityOverlay: HTMLDivElement | null = null;
  private isCapturing = false;

  /**
   * Initialize security measures
   */
  initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Disable right-click context menu
    this.disableContextMenu();

    // Disable keyboard shortcuts for screenshots
    this.disableScreenshotShortcuts();

    // Disable text selection on protected content
    this.disableTextSelection();

    // Detect screen sharing
    this.detectScreenSharing();

    // Detect visibility changes
    this.detectVisibilityChanges();

    // Disable dev tools
    this.disableDevTools();

    // Disable copy/paste
    this.disableCopyPaste();

    // Disable print
    this.disablePrint();

    // Create security overlay
    this.createSecurityOverlay();

    console.log('🛡️ Screen security initialized');
  }

  /**
   * Disable right-click context menu
   */
  private disableContextMenu() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
  }

  /**
   * Disable keyboard shortcuts for screenshots
   */
  private disableScreenshotShortcuts() {
    document.addEventListener('keydown', (e) => {
      // PrintScreen key
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        this.showSecurityWarning();
        return false;
      }

      // Windows: Win + Shift + S (Snipping Tool)
      if (e.metaKey && e.shiftKey && e.key === 's') {
        e.preventDefault();
        this.showSecurityWarning();
        return false;
      }

      // Mac: Cmd + Shift + 3 or 4 (Screenshots)
      if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4')) {
        e.preventDefault();
        this.showSecurityWarning();
        return false;
      }

      // Disable F12 (Dev Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+I (Dev Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+P (Print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        return false;
      }
    });
  }

  /**
   * Disable text selection
   */
  private disableTextSelection() {
    const style = document.createElement('style');
    style.textContent = `
      .protected-content,
      .protected-content * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      
      /* Prevent dragging images */
      .protected-content img {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
      
      /* Hide content during print */
      @media print {
        body * {
          visibility: hidden !important;
        }
        body::after {
          content: 'Printing is not allowed for security reasons.';
          visibility: visible !important;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 24px;
          color: #333;
        }
      }
    `;
    document.head.appendChild(style);

    // Add protected-content class to main content areas
    setTimeout(() => {
      const mainContent = document.querySelector('main') || document.querySelector('.layout-content');
      if (mainContent) {
        mainContent.classList.add('protected-content');
      }
    }, 1000);
  }

  /**
   * Detect screen sharing via Display Media API
   */
  private detectScreenSharing() {
    // Check if getDisplayMedia was called
    const originalGetDisplayMedia = navigator.mediaDevices?.getDisplayMedia;
    
    if (originalGetDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia = async (constraints) => {
        console.log('🚨 Screen sharing attempt detected!');
        this.showSecurityOverlay();
        this.notifyCallbacks(true);
        
        // Still allow the call but show overlay
        const stream = await originalGetDisplayMedia.call(navigator.mediaDevices, constraints);
        
        // Listen for when sharing stops
        stream.getVideoTracks().forEach(track => {
          track.addEventListener('ended', () => {
            this.hideSecurityOverlay();
            this.notifyCallbacks(false);
          });
        });
        
        return stream;
      };
    }

    // Periodically check for screen capture
    this.checkScreenCapture();
  }

  /**
   * Check for screen capture using experimental APIs
   */
  private async checkScreenCapture() {
    try {
      // Use experimental Capture Handle API if available
      // @ts-ignore
      if (navigator.mediaDevices?.setCaptureHandleConfig) {
        // @ts-ignore
        navigator.mediaDevices.setCaptureHandleConfig({
          exposeOrigin: true,
          handle: 'ai-tutor-protected',
          permittedOrigins: []
        });
      }
    } catch (e) {
      // API not supported
    }
  }

  /**
   * Detect tab visibility changes
   */
  private detectVisibilityChanges() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('📱 Tab hidden - possible screenshot');
      }
    });

    // Detect when window loses focus (possible screen recording)
    window.addEventListener('blur', () => {
      console.log('👁️ Window lost focus');
    });
  }

  /**
   * Disable developer tools
   */
  private disableDevTools() {
    // Detect DevTools opening via debugger
    const checkDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // Dev tools might be open
        console.log('⚠️ Developer tools may be open');
      }
    };

    setInterval(checkDevTools, 1000);

    // Detect debugger
    setInterval(() => {
      const start = performance.now();
      // debugger; // Uncomment in production to detect debugger
      const end = performance.now();
      if (end - start > 100) {
        console.log('⚠️ Debugger detected');
      }
    }, 1000);
  }

  /**
   * Disable copy/paste
   */
  private disableCopyPaste() {
    document.addEventListener('copy', (e) => {
      e.preventDefault();
      return false;
    });

    document.addEventListener('cut', (e) => {
      e.preventDefault();
      return false;
    });

    document.addEventListener('paste', (e) => {
      // Allow paste in input fields
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return true;
      }
      e.preventDefault();
      return false;
    });
  }

  /**
   * Disable printing
   */
  private disablePrint() {
    window.addEventListener('beforeprint', (e) => {
      e.preventDefault();
      this.showSecurityWarning();
    });
  }

  /**
   * Create security overlay element
   */
  private createSecurityOverlay() {
    this.securityOverlay = document.createElement('div');
    this.securityOverlay.id = 'screen-security-overlay';
    this.securityOverlay.innerHTML = `
      <div class="security-overlay-content">
        <div class="security-icon">🛡️</div>
        <h2>Screen Sharing Detected</h2>
        <p>For security reasons, content is hidden while screen recording or screen sharing is active.</p>
      </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      #screen-security-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        z-index: 999999;
        display: none;
        align-items: center;
        justify-content: center;
      }
      
      #screen-security-overlay.visible {
        display: flex;
      }
      
      .security-overlay-content {
        text-align: center;
        padding: 40px;
        max-width: 400px;
      }
      
      .security-icon {
        font-size: 64px;
        margin-bottom: 20px;
      }
      
      .security-overlay-content h2 {
        font-size: 24px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 12px 0;
      }
      
      .security-overlay-content p {
        font-size: 16px;
        color: #6B7280;
        line-height: 1.6;
        margin: 0;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(this.securityOverlay);
  }

  /**
   * Show security overlay
   */
  showSecurityOverlay() {
    this.isCapturing = true;
    if (this.securityOverlay) {
      this.securityOverlay.classList.add('visible');
    }
  }

  /**
   * Hide security overlay
   */
  hideSecurityOverlay() {
    this.isCapturing = false;
    if (this.securityOverlay) {
      this.securityOverlay.classList.remove('visible');
    }
  }

  /**
   * Show security warning toast
   */
  private showSecurityWarning() {
    // Create and show a toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #EF4444;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideUp 0.3s ease;
    `;
    toast.textContent = '🛡️ Screenshots are disabled for security';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  /**
   * Subscribe to security state changes
   */
  onSecurityChange(callback: SecurityCallback) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all callbacks
   */
  private notifyCallbacks(isCapturing: boolean) {
    this.callbacks.forEach(cb => cb(isCapturing));
  }

  /**
   * Check if currently being captured
   */
  isBeingCaptured() {
    return this.isCapturing;
  }
}

// Export singleton instance
export const screenSecurity = new ScreenSecurityService();
export default screenSecurity;
