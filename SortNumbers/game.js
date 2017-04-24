var game = (function () {
    function draw(options) {
        if(isValid(options)) {
            return new init(options);
        }
    }

    function isValid(options) {
        if(!validateElement(options.element)) {
            return false;
        }
        return true;
    }

    function validateElement(ele) {
        if(typeof ele == 'undefined') {
            console.warn("Please provide valid element");
            return false;
        }
        ele = getElement(ele);
        if(!ele) {
            return false;
        }
        return true;
    }

    function getElement(ele) {
        var res;

        if(!ele) {
            console.warn('Element not present in page');
            return false;
        }

        if(typeof ele == 'string') {
            res = document.querySelectorAll(ele);
        }
        else if(ele.length) {
            res = ele;
        }
        else {
            res = [ele];
        }

        if(res.length == 0) {
            console.warn('Element not present in page');
            return false;
        }

        return res;
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    init.prototype.isSorted = function () {
        var isSorted = true;
        var prev = parseInt(document.querySelector("[data-value='" + 0 + "']").innerText);
        var current = 0;
        for(var i = 1; i < this.n*this.n - 1; i++) {
            current = parseInt(document.querySelector("[data-value='" + i + "']").innerText);
            if(current < prev) {
                return false;
            }
            prev = current;
        }
        return isSorted;
    }

    init.prototype.getTemplate = function (data) {
        var template = '<div class="dropdown" style="float:left;"> <button class="dropbtn">New Game</button> <div class="dropdown-content" style="left:0;"> <a id="easy" href="#">Easy</a> <a id="medium" href="#">Medium</a> <a id="hard" href="#">Hard</a> </div> </div>';
        var n = this.n;
        var temp = "";
        var arr = [];

        for (var i = 0; i < n*n; i++) {
            arr[i] = i + 1;
        }
        arr = shuffle(arr);
        var num = getRandomArbitrary(1, n*n);

        var index = 1;

        for(var i = 0; i < n; i++) {
            temp += "<div class='parent'>";
            for(var j = 0; j < n; j++) {
                if(index == num) {
                    temp += "<div data-value="+ (index - 1) +" class='child fill'>" + arr[index - 1] + "</div>";
                }
                else {
                    temp += "<div data-value="+ (index - 1) +" class='child'>" + arr[index - 1] + "</div>";
                }
                index++;
            }
            temp += "</div>";
        }

        template += '<div id="myCanvas" width="480" height="480">' + temp + '</div>';
        return template;
    }
    init.prototype.reset = function () {
        this.render();
        this.bindEvents();
    }

    init.prototype.render = function () {
        var self = this;
        this.elements.forEach(function (item, index) {
            var ele = this.getTemplate();
            item.innerHTML = ele;
        }, this);
    }

    init.prototype.setStyle = function () {
        var list = document.getElementsByClassName("parent");
        for(var i = 0; i < list.length; ++i){
            list[i].style.height = 100 / this.n + "%";
        }

        list = document.getElementsByClassName("child");
        for(var i = 0; i < list.length; ++i){
            list[i].style.width = 100 / this.n - 1 + "%";
        }
    }

    init.prototype.bindEvents = function () {
        var list = document.getElementsByClassName('child');
        var self = this;
        for (var i = 0, len = list.length; i < len; i++) {
            list[i].addEventListener('click', function (e) {
                var current = e.target.dataset.value;
                var prev = document.getElementsByClassName('fill')[0].dataset.value;
                if(Math.abs(current - prev) == 1 || Math.abs(current - prev) == self.n) {
                    var currentEle =  document.querySelector("[data-value='" + current + "']");
                    var prevEle =  document.querySelector("[data-value='" + prev + "']");
                    currentEle.setAttribute('class', 'child fill');
                    prevEle.setAttribute('class', 'child');

                    var temp = currentEle.innerText;
                    currentEle.innerText = prevEle.innerText;
                    prevEle.innerText = temp;

                    if(self.isSorted()) {
                        alert("You won");
                    }
                }
            }, false);
        }

        document.getElementById('medium').addEventListener('click', function (e) {
            self.n = 4;
            self.reset();
            self.setStyle.apply(self);
        });

        document.getElementById('easy').addEventListener('click', function (e) {
            self.n = 3;
            self.reset();
            self.setStyle.apply(self);
        });

        document.getElementById('hard').addEventListener('click', function (e) {
            self.n = 5;
            self.reset();
            self.setStyle.apply(self);
        });


    }

    function init(options) {
        this.model = options;
        this.n = 3;
        this.elements = [].slice.call(getElement(this.model.element));
        this.render();
        this.bindEvents();
    }

    return {
        draw: draw
    }
})();