var Scanner = HTML._$.Scanner;
var getContent = HTML._$.getContent;

var CharRef = HTML.CharRef;
var Comment = HTML.Comment;

Tinytest.add("html - parse content", function (test) {

  var succeed = function (input, expected) {
    var endPos = input.indexOf('^^^');
    if (endPos < 0)
      endPos = input.length;

    var scanner = new Scanner(input.replace('^^^', ''));
    var result = getContent(scanner);
    test.equal(scanner.pos, endPos);
    test.equal(UI.toCode(result), UI.toCode(expected));
  };

  var fatal = function (input, messageContains) {
    var scanner = new Scanner(input);
    var error;
    try {
      getContent(scanner);
    } catch (e) {
      error = e;
    }
    test.isTrue(error);
    if (messageContains)
      test.isTrue(messageContains && error.message.indexOf(messageContains) >= 0, error.message);
  };


  succeed('', null);
  succeed('^^^</', null);
  succeed('abc', 'abc');
  succeed('abc^^^</x>', 'abc');
  succeed('a&lt;b', ['a', CharRef({html: '&lt;', str: '<'}), 'b']);
  succeed('<!-- x -->', Comment(' x '));
  succeed('&acE;', CharRef({html: '&acE;', str: '\u223e\u0333'}));
  succeed('&zopf;', CharRef({html: '&zopf;', str: '\ud835\udd6b'}));
  succeed('&&>&g&gt;;', ['&&>&g', CharRef({html: '&gt;', str: '>'}), ';']);

  // Can't have an unescaped `&` if followed by certain names like `gt`
  fatal('&gt&');
  // tests for other failure cases
  fatal('<');
});
