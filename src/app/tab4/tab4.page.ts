import { FotoService } from './../services/foto.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

export interface fileFoto{
  name : string; //filePath
  path : string; //webViewPath

}
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  urlImageStorage : string[] = [];

  constructor(
    private afStorage : AngularFireStorage,
    public fotoService : FotoService
  
  ) { }

  async ngOnInit() {
    
  }



  hapusFoto(){
    var refImage = this.afStorage.storage.ref('imgStorage');
    refImage.listAll()
    .then((res) => {
      res.items.forEach((itemRef)=>{
        itemRef.delete().then(()=>{
          //menampilkan data
          this.tampilkanData()
        });
      });
    }).catch((error)=>{
      console.log(error)
    })
  }

  tampilkanData(){
    this.urlImageStorage=[];
    var refImage = this.afStorage.storage.ref('imgStorage');
    refImage.listAll()
    .then((res) => {
      res.items.forEach((itemRef) =>
      itemRef.getDownloadURL().then(url =>{
        this.urlImageStorage.unshift(url)
      })
      )
    }).catch((error) =>{
      console.log(error)
    })

  }

  uploadFoto(){
    this.urlImageStorage=[];
    for(var index in this.fotoService.dataFoto){
      if(this.fotoService.dataFoto[index].filePath!="Load")
      {
      console.log(index, this.fotoService.dataFoto[index].filePath)
      
      const imgFilePath = `imgStorage/${this.fotoService.dataFoto[index].filePath}`
      this.afStorage.upload(imgFilePath,this.fotoService.dataFoto[index].dataImage).then(() => {
        this.afStorage.storage.ref().child(imgFilePath).getDownloadURL().then((url)=>{
          this.urlImageStorage.unshift(url)
          console.log(url);
        });
      });
    }
    }
  }

  async ionViewDidEnter(){
    await this.fotoService.loadFoto();
    this.tampilkanData()
  }

}
