import { Component, ElementRef, ViewChild } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import jsQR from 'jsqr';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  scanActive = false;
  scanResult = null;
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;

  videoElement: any;
  canvasElement: any;
  canvasContext: any;

  loading: HTMLIonLoadingElement;

  constructor(private toastCtrl: ToastController, private loadingCtrl: LoadingController) { }

  ngAfterViewInit(): void {
    this.videoElement = this.video.nativeElement;
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
  }


  async startScan() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'enviroment' }
    });
    this.videoElement.srcObject = stream;
    this.videoElement.setAttribute('playsinline', true);
    this.videoElement.play();

    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });

    await this.loading.present();
    requestAnimationFrame(this.scan.bind(this));
  }

  async scan() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.scanActive = true;
      }
      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      // Get data out of the canvas

      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
      console.log("🚀 ~ file: home.page.ts ~ line 78 ~ HomePage ~ scan ~ code", code);
      if (code) {
        this.scanActive = false;
        this.scanResult = code.data;
        this.showQrToast();
      }
      else {
        if (this.scanActive){
          requestAnimationFrame(this.scan.bind(this));
        }
      }
    }
    else {
      requestAnimationFrame(this.scan.bind(this));
    }
  }

  // Helpers functions

  stopScan() {
    this.scanActive = false;
  }

  reset() {
    this.scanResult = null;
  }

  async showQrToast() {
    const toast = await this.toastCtrl.create({
      message: `Open ${this.scanResult}?`,
      position: 'top',
      buttons: [
        {
          text: 'Open',
          handler: () => {
            window.open(this.scanResult, '_syatem', 'location=yes');
          }
        }
      ]

    });
    toast.present();
  }


}
