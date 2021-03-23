import { Directive, Injectable } from '@angular/core';
import { CameraPhoto, CameraResultType, CameraSource, Capacitor, FilesystemDirectory, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';

const { Camera,Filesystem, Storage} = Plugins
@Injectable({
  providedIn: 'root'
})



export class FotoService {

  constructor(platform: Platform) {
    this.platform = platform
   }
  
  public dataFoto : Photo[] =[];
  private keyFoto : string = "foto";
  private platform : Platform;

  //TAMBAH FOTO================================================
  
  public async tambahFoto(){
    console.log("tambah foto")
    const Foto = await Camera.getPhoto({
      resultType : CameraResultType.Uri,
      source : CameraSource.Camera,
      quality:100

    });
    console.log(Foto);

    const fileFoto = await this.simpanFoto(Foto)

    this.dataFoto.unshift(fileFoto);

    Storage.set({
      key :  this.keyFoto,
      value : JSON.stringify(this.dataFoto)
    })

  }
//SIMPAN FOTO==================================================
  public async simpanFoto(foto: CameraPhoto){
    console.log("simpan foto")
    const base64Data = await this.readAsBase64(foto);

    const namaFile = new Date().getTime()+'.jpeg'

    const simpanFile = await Filesystem.writeFile({
      path : namaFile,
      data : base64Data,
      directory : FilesystemDirectory.Data 
    });

    const response = await fetch(foto.webPath);
    const blob = await response.blob();
    const dataFoto = new File(
      [blob], 
      foto.path, 
      { type : "image.jpeg" }
      )

    if(this.platform.is('hybrid')){
      return{
        filePath : simpanFile.uri,
        webviewPath : Capacitor.convertFileSrc(simpanFile.uri),
        dataImage : dataFoto
      }
    }else{
      return {
        filePath : namaFile,
        webviewPath : foto.webPath,
        dataImage : dataFoto
      }
    }
  }
  //LOAD FOTO =========================================================
  public async loadFoto(){
    var count = 1
    const listFoto = await Storage.get({key: this.keyFoto})
    this.dataFoto = JSON.parse(listFoto.value) || [];
    if(!this.platform.is('hybrid')){
      for (let foto of this.dataFoto){
        // if(foto.filePath!="Load"){
          // console.log(count,foto.filePath)
        count+=1
        if(foto.filePath!="Load"){
          const readFile = await Filesystem.readFile({
            path : foto.filePath,
            directory : FilesystemDirectory.Data
          });
          foto.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
          const response = await fetch(foto.webviewPath);
          const blob = await response.blob();
          foto.dataImage = new File([blob],foto.filePath,{
            type : "image/jpeg"
          });
        // }
      }
    }
  }
  }
//==========================================================================
  private async readAsBase64(foto: CameraPhoto){
    console.log("read works")
    if(this.platform.is('hybrid')){
      const file = await Filesystem.readFile({
        path: foto.path
      });
      return file.data;
    }
    else{
      const response = await fetch(foto.webPath);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }
//=============================================================================
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject)=>{
    console.log("convert works")
    
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });


}

export interface Photo{
  filePath : string;
  webviewPath : string;
  dataImage : File;
}