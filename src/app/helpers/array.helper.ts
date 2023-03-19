import { BehaviorSubject, Observable } from 'rxjs';

export type HttpCallback<T, Key> = (id: Key) => Observable<T[]>;

export class ArrayHelper<T, Key = number> {
  private readonly array: Map<Key, BehaviorSubject<T[]>>;

  constructor(public getter: HttpCallback<T, Key>) {
    this.array = new Map<Key, BehaviorSubject<T[]>>();
  }

  getObjects(id: Key): BehaviorSubject<T[]> {
    return this.array.get(id) ?? this.initCache(id);
  }

  forceCacheUpdate(id: Key): void {
    this.getter(id).subscribe((values: T[]) => {
      const cachedObject = this.array.get(id) ?? this.initCache(id);
      cachedObject.next(values);
    });
  }

  private initCache(id: Key): BehaviorSubject<T[]> {
    const cachedObject = new BehaviorSubject<T[]>([]);
    this.array.set(id, cachedObject);
    return cachedObject;
  }
}
