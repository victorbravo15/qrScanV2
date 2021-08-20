import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  scanActive = false;
  scanResult = null;
  @ViewChild('video', { static: false }) video: ElementRef;

  videoElement: any;

  constructor(private toastCtrl: ToastController) {}

ngAfterViewInit(): void {
  this.videoElement = this.video.nativeElement;
  
}
  startScan(){

  }

  reset(){
    this.scanResult = null;
  }

  stopScan(){
    this.scanActive = false;
  }
}
