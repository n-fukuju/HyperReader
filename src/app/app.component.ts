import { Component } from '@angular/core';
/// <reference path="mecab.d.ts"/>

@Component({
  selector: 'app-root',
  //templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template:`
  <h1>{{title}}</h1>
  <div>
    <label>status:</label><label id="status">{{isLoaded}}</label><br>
    <textarea [(ngModel)]="inputText" placeholder="入力欄"></textarea><br>
    <label>{{currentText}}</label><br>
    <input type="button" value="start" (click)="startClick()"><br>
  </div>
  `
})
export class AppComponent {
  title = 'hyper reader.';
  inputText: string = `Angularは、Web技術でのアプリケーション構築を容易にするプラットフォームです。
  宣言的テンプレート、依存性注入、包括的なツール群や、統合されたベストプラクティスを組み合わせて、開発の課題を解決します。
  Angularは、Web、モバイル、またはデスクトップで動作するアプリケーションを構築できるようにします。
  `;
  isLoaded: boolean = false;
  analyzedText: string;
  builtText: string[];
  currentText: string;
  async startClick(){
    if(toAnalyze){console.log("found.")}else{console.log("not found.");}
    // 入力テキストの解析
    this.parse();
    // 表示更新
    let i:number = 0;
    for(let text of this.builtText){
      this.currentText = text;
      await sleep(500);
    }
    this.currentText = '<おしまい>';
  }
  bytes(str:string):number{
    return(encodeURIComponent(str).replace(/%../g,"x").length);
  }
  parse(){
    // mecab で解析
    this.analyzedText = toAnalyze(this.inputText);
    let tmp: string = '';
    let word: string = '';
    let i: number = 0;
    let point: string[] = ['、','。'];
    this.builtText = [tmp];
    // 解析結果の形態素を、適当な長さにまとめる。
    for(let line of this.analyzedText.split('\n')){
      word = line.split('\t')[0];
      if(word.startsWith('EOS')){
        // End of Statement.
        word = '';
      }else if(this.bytes(tmp) + this.bytes(word) < 15){
        // 17バイトで制限（暫定）
        tmp += word;
      }else if(point.indexOf(word) >= 0){
        // 句読点は末尾に結合
        tmp += word;
      }else{
        i += 1;
        tmp = word;
        this.builtText.push('');
      }
      this.builtText[i] = tmp;
    }
  }
}

function sleep(msec):Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, msec);
  });
}