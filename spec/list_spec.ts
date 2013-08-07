///<reference path="../qunit.d.ts" />
///<reference path="../lib/list.ts"/>

QUnit.module("Test of HashSet", {
    setup: function () {
    },
    teardown: function () {
    }
});

test("Init List with empty constructor", function () {
    var list = new Collections.List<number>();
    
    equal(0, list.count, "count should be zero");
});

test("Init list with a collection", function() {
    var list : Collections.List<number>;
    var collection = new Collections.List<number>();

    collection.add(0)
              .add(1)
              .add(2)
              .add(3);

    list = new Collections.List(collection);

    equal(list.count, 4, "Count should be 4");
    equal(list.count, collection.count, "Count of 'list' should be equal count of 'collection'");

    deepEqual(list.toArray(), [0, 1, 2, 3]);
    deepEqual(collection.toArray(), [0, 1, 2, 3]);
});

test("Add items to list", function() {
    var list = new Collections.List<number>();

    list.add(0).add(1).add(2);

    equal(list.count, 3, "Count should be 3");
});

test("Testing methods", function() {
    var getList = function() {
        var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return new Collections.List<number>(array);
    }

    equal(getList().at(1), 2, "Should be equal to 2");
    equal(getList().indexOf(1), 0, "Should be equal to 1");
    equal(getList().insert(0, 10).at(0), 10, "Should be equal to 10");

    equal(getList().remove(2).at(1), 3, "Should be equal to 3");
    equal(getList().remove(1).at(0), 2, "Should be equal to 2");
    equal(getList().remove(10).at(8), 9, "Should be equal to 9");
    equal(getList().clear().indexOf(1), -1, "Should be equal to -1");
    equal(getList().contains(3), true, "Should be true");
    equal(getList().contains(30), false, "Should be false");

    equal(getList().find(x => x % 2 === 0), 2, "Should be equal to 2");
    deepEqual(getList().findAll(x => x % 2 === 0).toArray(), [2, 4, 6, 8, 10], "Should be equal to [2, 4, 6, 8, 10]");

});

