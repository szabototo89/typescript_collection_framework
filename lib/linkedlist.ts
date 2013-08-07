///<reference path="interfaces.ts" />

module Collections {

	export class LinkedListNode<T> {
		constructor(public value: T, public list: LinkedList<T>, public next?: LinkedListNode<T>, public previous?: LinkedListNode<T>) { }
	}

	export class LinkedList<T> /*implements Collections.ICollection<T>, Collections.IEnumerable<T>*/ {
		private _first: LinkedListNode<T>;
		private _last: LinkedListNode<T>;
		private length: number;

		public get first(): LinkedListNode<T> {
			return this._first;
		}

		public get last(): LinkedListNode<T> {
			return this._last;
		}

		constructor(collection?: IEnumerable<T>) {
			this._first = undefined;
			if (collection)
				this.initializeFromCollection(collection);
		}

		public toArray() {
			var result : T[] = [];

			var current = this.first;

			while (current) {
				result.push(current.value);
				current = current.next;
			}

			return result;
		}

		public getEnumerator() {
			return this.toArray().getEnumerator();
		}

		public get count(): number { return this.length; }

        public get isReadOnly(): boolean { return false; }

        public add(item: T): LinkedList<T> {
        	if (this._last) {
        		this._last.next = new LinkedListNode<T>(item, this, undefined, this._last);
        		this._last = this._last.next;
        	}
        	else {
        		this._first = this._last = new LinkedListNode<T>(item, this);
        	}
        	this.length++;
        	return this;
        }

        public clear(): LinkedList<T> {
        	this._first = this._last = undefined;
        	this.length = 0;
        	return this;
        }

        public contains(item: T): boolean {
        	var current = this.first;

        	while (current) {
        		if (current.value === item)
        			return true;
        		current = current.next;
        	}

        	return false;
        }

        public at(index: number): T {
        	var node = this.getNodeByIndex(index);
        	if (node)
        		return node.value;
        	return undefined;
        }

        private getNodeByIndex(index: number): LinkedListNode<T> {
        	var current = this.first;

        	if (index === this.count)
        		return this.last;

        	for (var i = 0; i < index; ++i) {
        		if (!current)
        			return undefined;

        		if (i == index)
        			return current;

        		current = current.next;
        	}

        	return undefined;
        }

        private getNodeByValue(value: T) : LinkedListNode<T> {
        	return this.getNodeByMatch({ match: item => item.value === value });
        }

        private getNodeByMatch(params: { 
        		match: (node: LinkedListNode<T>) => boolean;
        		start?: LinkedListNode<T>;
        		step?: (node: LinkedListNode<T>) => LinkedListNode<T>;
        	}): LinkedListNode<T> {
        	if (!params.start)
        		params.start = this.first;
        	if (!params.step)
        		params.step = node => node.next;

        	var current = params.start; 
        	
        	while (current) {
        		if (params.match(current)) {
        			return current;
        		}
        		current = params.step(current);
        	}

        	return undefined;
        }

        public copyTo(array: T[], arrayIndex: number) {
        	if (!array || array.length === 0)
        		return this;

        	var node = this.getNodeByIndex(arrayIndex);

        	if (!node)
        		return this;

        	var linkedList = new LinkedList<T>(array);

        	if (node.next) {
        		node.next.previous = linkedList.last;
        	}

        	node.next = linkedList.first;

        	return this;
        }

        public removeFirst() {
        	return this.remove({ node: this.first });
        }

        public removeLast() {
        	return this.remove({ node: this.last });
        }

        public remove(params: { item?: T; node?: LinkedListNode<T>; }) {
        	var node: LinkedListNode<T>;

        	if (params.item)
        		node = this.getNodeByValue(params.item);
        	else
        		node = params.node;

        	if (!node || node.list !== this)
        		return this;

        	if (node.previous) {
        		node.previous.next = node.next;
        	}
        	if (node.next) {
        		node.next.previous = node.previous;
        	}

        	return this;
        }

        public addFirst(params: { newNode?: LinkedListNode<T>; value?: T; }) {
        	return this.addBefore({ node: this.first, newNode: params.newNode, value: params.value });
        }

        public addLast(params: { newNode?: LinkedListNode<T>; value?: T; }) {
        	return this.addAfter({ node: this.last, newNode: params.newNode, value: params.value });
        }

        public addAfter(params: { node: LinkedListNode<T>; newNode?: LinkedListNode<T>; value?: T; }) {
        	if (params.node.list !== this)
        		return this;

        	if (!params.node)
        		return this;

        	var addedNode: LinkedListNode<T> = undefined;
        	if (params.newNode)
        		addedNode = params.newNode;
        	else if (params.value)
        		addedNode = new LinkedListNode<T>(params.value, this);

        	if (addedNode) {
	    		addedNode.previous = params.node;
	    		addedNode.next = params.node.next;
	    		params.node.next = addedNode;
	    	}

	    	if (this.last === params.node)
	    		this.last = addedNode;

        	return this;
        }

        public addBefore(params: { node: LinkedListNode<T>; newNode?: LinkedListNode<T>; value?: T; }) {
        	if (params.node.list !== this)
        		return this;

        	if (!params.node)
        		return this;

        	var addedNode: LinkedListNode<T> = undefined;

        	if (params.newNode) {
        		params.newNode.list = this;
        		addedNode = params.newNode;
        	}
        	else if (params.value)
        		addedNode = new LinkedListNode<T>(params.value, this);

        	if (addedNode) {
	    		addedNode.previous = params.node.previous;
	    		addedNode.next = params.node;
	    		params.node.previous = addedNode;
	    	}

	    	if (this.first === params.node)
	    		this.first = addedNode;

        	return this;
        }

        public find(params: { value?: T; match?: (item: T) => boolean; }) {
        	if (params.value) {
        		return this.getNodeByValue(params.value);
        	}
        	else if (params.match) 
        		return this.getNodeByMatch({ match: node => params.match(node.value) });

        	return undefined;
        }

        public findLast(params: { value?: T; match?: (item: T) => boolean; }) {
        	if (params.value) {
        		return this.getNodeByMatch({ match: node => node.value === params.value, 
        									 step: node => node.previous,
        									 start: this.last });
        	}
        	else if (params.match) 
        		return this.getNodeByMatch({ match: node => params.match(node.value), 
        									 step: node => node.previous,
        									 start: this.last });

        	return undefined;
        }

		private initializeFromCollection(collection: IEnumerable<T>) {
			var enumerator = collection.getEnumerator().reset();
			var current: LinkedListNode<T> = undefined;

			this.length = 0;
			while (enumerator.moveNext()) {
				if (!current) {
					current = new LinkedListNode<T>(enumerator.current, this);
					this._first = current;
				} 
				else {
					current.next = new LinkedListNode<T>(enumerator.current, this, undefined, current);
					current = current.next;
				}
				this.length++;
			}

			this._last = current;

			return this;
		}
	}
}