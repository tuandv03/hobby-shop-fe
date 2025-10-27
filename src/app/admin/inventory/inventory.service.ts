import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../core/base-service.service';
import { InventoryItem } from '../models/invemtory-item';

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends BaseService {

  searchInventory(query?: string): Observable<InventoryItem[]> {
    const params = query ? { search: query } : {};
    return this.get<InventoryItem[]>('/inventory', params);
  }

  getAllInventory(): Observable<InventoryItem[]> {
    return this.get<InventoryItem[]>('/inventory');
  }
}