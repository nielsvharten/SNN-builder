import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

import { NetworkArray } from "./editor";

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  constructor(private http: HttpClient) { }

  getNetworks(): Observable<NetworkArray> {
    return this.http.get('http://127.0.0.1:8000/api/v1/questions/') as Observable<NetworkArray>;
  }
}
