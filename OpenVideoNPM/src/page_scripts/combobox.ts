export abstract class ComboBoxEntry<T> {
    private el_ : HTMLElement;
    private textNode_ : Text;
    private data_ : T;
    private comboBox_ : ComboBox<T>;

    constructor(comboBox : ComboBox<T>) {
        this.comboBox_ = comboBox;
        this.el_ = document.createElement("div");
        this.textNode_ = document.createTextNode("");
        this.el_.appendChild(this.textNode_);
    }
    get index() {
        return this.comboBox_.items.indexOf(this);
    }
    get comboBox() {
        return this.comboBox_;
    }
    get text() {
        return this.textNode_.data;
    }
    set text(newText : string) {
        this.textNode_.data = newText;
    }
    get data() {
        return this.data_;
    }
    set data(data : T) {
        this.data_ = data;
        this.repaint();
    }
    get isDisplay() {
        return this.el_.classList.contains("display");
    }
    get isSelected() {
        return this.comboBox_.selected == this;
    }
    get el() {
        return this.el_;
    }
    abstract repaint() : void;
    
    remove() {
        this.comboBox_.removeItem(this.index);
        this.onRemoved();
    }
    
    onRemoved() {
        
    }
    onSelected() {
        
    }
}
export abstract class ComboBox<T> {
    
    private items_ : ComboBoxEntry<T>[] = [];
    private el_ : HTMLElement;
    private dropdown_ : HTMLElement;
    private display_ : ComboBoxEntry<T>;
    private selected_ : ComboBoxEntry<T> = null;
    private defaultData_ : T;

    constructor(id : string, defaultData : T) {
        this.defaultData_ = defaultData;
        let el = document.createElement("div");
        el.id = id;
        el.className = "dropdown";
       
        this.dropdown_ = document.createElement("div");
        this.dropdown_.className = "dropdown-content";
        
        this.display_ = this.createEntry(defaultData);
        this.display_.el.classList.add("display");
        
        el.appendChild(this.display_.el);
        el.appendChild(this.dropdown_);
        this.el_ = el;
    }

    protected abstract createEntry(data : T) : ComboBoxEntry<T>;
    
    get el() {
        return this.el_;
    }
    get items() {
        return this.items_;
    }
    get entries() {
        return this.items_.map(function(el){
            return el.data;
        });
    }
    set entries(entries : T[]) {
        let this_ = this;
        this.clear();
        entries.forEach(function(el){ this_.addItem(el); });
    }
    get selected() {
        return this.selected_;
    }
    get display() {
        return this.display_;
    }
    get defaultData() {
        return this.defaultData_;
    }
    select(index : number) {
        this.selected_ = this.items_[index] || null;
        if(this.selected_) {
            this.display_.data = this.selected_.data;
        }
        else {
            this.display_.data = this.defaultData_;
        }
    }
    addItem(entry : T) {
        let item = this.createEntry(entry);
        this.dropdown_.appendChild(item.el);
        this.items_.push(item);
        let this_= this;
        item.el.addEventListener("click", function(){
            this_.display_.data = item.data;
            this_.selected_ = item;
            this_.onSelected();
            item.onSelected();
        });
        return item;
    }
    insertItem(entry : T, index : number) {
        if(index < 0) {
            index = 0;
        }
        if(index >= this.dropdown_.children.length) {
            return this.addItem(entry);
        }
        else {
            let item = this.createEntry(entry);
            let this_= this;
            item.el.addEventListener("click", function(){
                this_.display_.data = item.data;
                this_.selected_ = item;
                this_.onSelected();
                item.onSelected();
            });
            this.dropdown_.insertBefore(item.el, this.dropdown_.children[index]);
            this.items_.splice(index, 0, item);
            return item;
        }
    }
    removeItem(index : number) {
        let item = this.items_[index];
        item.el.remove();
        this.items_.splice(index, 1);
        return item.data;
    }
    clear() {
        for(let item of this.items_) {
            item.el.remove();
        }
        this.selected_ = null;
        this.display_.data = this.defaultData_;
        this.items_ = [];
    }
    
    onSelected() {
        
    }
    
    
}