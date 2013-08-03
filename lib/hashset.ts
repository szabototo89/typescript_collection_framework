
import M = require("interfaces");


export module Collections {
    export class HashSet<T> implements M.Collections.ISet<T>, M.Collections.IEnumerator<T> {
        private set: T[] = [];
        private index: number = -1;

        constructor(collection?: M.Collections.IEnumerable<T>) {
            if (collection) {
                this.initializeFromCollection(collection);
            }
        }

        get count(): number {
            return this.set.length;
        }

        get isReadOnly(): boolean {
            return false;
        }

        get current(): T {
            this.index += 1;
            if (this.index === this.set.length) {
                throw new Error("Out of bound exception");
            }
            return this.set[this.index];
        }

        public add(item: T) {
            if (!this.contains(item)) {
                this.set.push(item);
            }
            return this;
        }

        public clear() {
            this.set = [];
            return this;
        }

        public contains(t: T): boolean {
            return this.set.indexOf(t) > -1;
        }

        public copyTo(array: T[], arrayIndex: number) {
            for (var i = arrayIndex; i < array.length; i += 1) {
                this.add(array[i]);
            }

            return this;
        }

        public exceptWith(other: M.Collections.IEnumerable<T>): M.Collections.ISet<T> {
            other.reset();

            while (other.moveNext()) {
                var index = this.set.indexOf(other.current);
                if (index > -1) {
                    this.set.splice(index, 1);
                }
            }
            return this;
        }

        public getEnumerator(): M.Collections.IEnumerator<T> {
            return undefined;
        }

        public intersectWith(other: M.Collections.IEnumerable<T>): M.Collections.ISet<T> {
            var newSet = new HashSet();

            other.reset();

            while (other.moveNext()) {
                var t: T = other.current;
                if (this.contains(t)) {
                    newSet.add(t);
                }
            }
            this.set = newSet.toArray();
            return this;
        }

        public isProperSubsetOf(other: M.Collections.IEnumerable<T>): boolean {
            var arr = other.toArray(),
                i = 0,
                max;

            if (other.toArray().length <= this.set.length) {
                return false;
            }
            for (i = 0, max = this.set.length; i < max; i += 1) {
                if (arr.indexOf(this.set[i]) === -1) {
                    return false;
                }
            }
            return true;
        }

        public isProperSupersetOf(other: M.Collections.IEnumerable<T>): boolean {
            other.reset();

            if (this.set.length <= other.toArray().length) {
                return false;
            }
            while(other.moveNext()) {
                if (!this.contains(other.current)) {
                    return false;
                }
            }
            return true;
        }

        public isSubsetOf(other: M.Collections.IEnumerable<T>): boolean {
            var arr = other.toArray(),
                i = 0,
                max;

            if (other.toArray().length < this.set.length) {
                return false;
            }
            for (i = 0, max = this.set.length; i < max; i += 1) {
                if (arr.indexOf(this.set[i]) === -1) {
                    return false;
                }
            }
            return true;
        }

        public isSupersetOf(other: M.Collections.IEnumerable<T>): boolean {
            other.reset();

            if (this.set.length < other.toArray().length) {
                return false;
            }
            while(other.moveNext()) {
                if (!this.contains(other.current)) {
                    return false;
                }
            }
            return true;
        }

        public overlaps(other: M.Collections.IEnumerable<T>): boolean {
            other.reset();

            while(other.moveNext()) {
                if (this.contains(other.current)) {
                    return true;
                }
            }
            return false;
        }

        public remove(item: T): M.Collections.ISet<T> {
            var index = this.set.indexOf(item);
            if (index !== -1) {
                this.set.splice(index, 1);
            }
            return this;
        }

        public removeAll(collection: M.Collections.ICollection<T>): M.Collections.ISet<T> {
            collection.reset();

            while(collection.moveNext()) {
                this.remove(collection.current);
            }
            return this;
        }

        public removeWhere(predicate: (t: T) => boolean) : boolean {
            var i = this.set.length - 1;

            for (; 0 < i; i -= 1) {
                if (predicate(this.set[i])) {
                    this.set.splice(i, 1);
                }
            }

            return true;
        }

        public setEquals(other: M.Collections.IEnumerable<T>): boolean {
            other.reset();

            if (other.toArray().length !== this.set.length) {
                return false;
            }
            while(other.moveNext()) {
                if (!this.contains(other.current)) {
                    return false;
                }
            }
            return true;
        }

        public symmetricExceptWith(other: M.Collections.IEnumerable<T>): M.Collections.ISet<T> {
            return this;
        }

        public toArray(): T[] {
            return this.set;
        }

        public unionWith(other: M.Collections.IEnumerable<T>): M.Collections.ISet<T> {
            other.reset();

            while(other.moveNext()) {
                this.add(other.current);
            }
            return this;
        }


        public reset(): void {
            this.index = -1;
        }

        public moveNext(): boolean {
            return this.index < this.set.length - 1;
        }


        private initializeFromCollection(collection: M.Collections.IEnumerable<T>): HashSet<T> {
            collection.reset();
            
            while (collection.moveNext()) {
                this.add(collection.current);
            }

            return this;
        }
    }
}