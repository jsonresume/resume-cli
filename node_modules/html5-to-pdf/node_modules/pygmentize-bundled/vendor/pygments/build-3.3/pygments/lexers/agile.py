# -*- coding: utf-8 -*-
"""
    pygments.lexers.agile
    ~~~~~~~~~~~~~~~~~~~~~

    Lexers for agile languages.

    :copyright: Copyright 2006-2013 by the Pygments team, see AUTHORS.
    :license: BSD, see LICENSE for details.
"""

import re

from pygments.lexer import Lexer, RegexLexer, ExtendedRegexLexer, \
     LexerContext, include, combined, do_insertions, bygroups, using, this
from pygments.token import Error, Text, Other, \
     Comment, Operator, Keyword, Name, String, Number, Generic, Punctuation
from pygments.util import get_bool_opt, get_list_opt, shebang_matches
from pygments import unistring as uni


__all__ = ['PythonLexer', 'PythonConsoleLexer', 'PythonTracebackLexer',
           'Python3Lexer', 'Python3TracebackLexer', 'RubyLexer',
           'RubyConsoleLexer', 'PerlLexer', 'LuaLexer', 'MoonScriptLexer',
           'CrocLexer', 'MiniDLexer', 'IoLexer', 'TclLexer', 'FactorLexer',
           'FancyLexer', 'DgLexer', 'Perl6Lexer']

# b/w compatibility
from pygments.lexers.functional import SchemeLexer
from pygments.lexers.jvm import IokeLexer, ClojureLexer

line_re  = re.compile('.*?\n')


class PythonLexer(RegexLexer):
    """
    For `Python <http://www.python.org>`_ source code.
    """

    name = 'Python'
    aliases = ['python', 'py', 'sage']
    filenames = ['*.py', '*.pyw', '*.sc', 'SConstruct', 'SConscript', '*.tac', '*.sage']
    mimetypes = ['text/x-python', 'application/x-python']

    tokens = {
        'root': [
            (r'\n', Text),
            (r'^(\s*)([rRuU]{,2}"""(?:.|\n)*?""")', bygroups(Text, String.Doc)),
            (r"^(\s*)([rRuU]{,2}'''(?:.|\n)*?''')", bygroups(Text, String.Doc)),
            (r'[^\S\n]+', Text),
            (r'#.*$', Comment),
            (r'[]{}:(),;[]', Punctuation),
            (r'\\\n', Text),
            (r'\\', Text),
            (r'(in|is|and|or|not)\b', Operator.Word),
            (r'!=|==|<<|>>|[-~+/*%=<>&^|.]', Operator),
            include('keywords'),
            (r'(def)((?:\s|\\\s)+)', bygroups(Keyword, Text), 'funcname'),
            (r'(class)((?:\s|\\\s)+)', bygroups(Keyword, Text), 'classname'),
            (r'(from)((?:\s|\\\s)+)', bygroups(Keyword.Namespace, Text),
             'fromimport'),
            (r'(import)((?:\s|\\\s)+)', bygroups(Keyword.Namespace, Text),
             'import'),
            include('builtins'),
            include('backtick'),
            ('(?:[rR]|[uU][rR]|[rR][uU])"""', String, 'tdqs'),
            ("(?:[rR]|[uU][rR]|[rR][uU])'''", String, 'tsqs'),
            ('(?:[rR]|[uU][rR]|[rR][uU])"', String, 'dqs'),
            ("(?:[rR]|[uU][rR]|[rR][uU])'", String, 'sqs'),
            ('[uU]?"""', String, combined('stringescape', 'tdqs')),
            ("[uU]?'''", String, combined('stringescape', 'tsqs')),
            ('[uU]?"', String, combined('stringescape', 'dqs')),
            ("[uU]?'", String, combined('stringescape', 'sqs')),
            include('name'),
            include('numbers'),
        ],
        'keywords': [
            (r'(assert|break|continue|del|elif|else|except|exec|'
             r'finally|for|global|if|lambda|pass|print|raise|'
             r'return|try|while|yield(\s+from)?|as|with)\b', Keyword),
        ],
        'builtins': [
            (r'(?<!\.)(__import__|abs|all|any|apply|basestring|bin|bool|buffer|'
             r'bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|'
             r'complex|delattr|dict|dir|divmod|enumerate|eval|execfile|exit|'
             r'file|filter|float|frozenset|getattr|globals|hasattr|hash|hex|id|'
             r'input|int|intern|isinstance|issubclass|iter|len|list|locals|'
             r'long|map|max|min|next|object|oct|open|ord|pow|property|range|'
             r'raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|'
             r'sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|'
             r'vars|xrange|zip)\b', Name.Builtin),
            (r'(?<!\.)(self|None|Ellipsis|NotImplemented|False|True'
             r')\b', Name.Builtin.Pseudo),
            (r'(?<!\.)(ArithmeticError|AssertionError|AttributeError|'
             r'BaseException|DeprecationWarning|EOFError|EnvironmentError|'
             r'Exception|FloatingPointError|FutureWarning|GeneratorExit|IOError|'
             r'ImportError|ImportWarning|IndentationError|IndexError|KeyError|'
             r'KeyboardInterrupt|LookupError|MemoryError|NameError|'
             r'NotImplemented|NotImplementedError|OSError|OverflowError|'
             r'OverflowWarning|PendingDeprecationWarning|ReferenceError|'
             r'RuntimeError|RuntimeWarning|StandardError|StopIteration|'
             r'SyntaxError|SyntaxWarning|SystemError|SystemExit|TabError|'
             r'TypeError|UnboundLocalError|UnicodeDecodeError|'
             r'UnicodeEncodeError|UnicodeError|UnicodeTranslateError|'
             r'UnicodeWarning|UserWarning|ValueError|VMSError|Warning|'
             r'WindowsError|ZeroDivisionError)\b', Name.Exception),
        ],
        'numbers': [
            (r'(\d+\.\d*|\d*\.\d+)([eE][+-]?[0-9]+)?j?', Number.Float),
            (r'\d+[eE][+-]?[0-9]+j?', Number.Float),
            (r'0[0-7]+j?', Number.Oct),
            (r'0[xX][a-fA-F0-9]+', Number.Hex),
            (r'\d+L', Number.Integer.Long),
            (r'\d+j?', Number.Integer)
        ],
        'backtick': [
            ('`.*?`', String.Backtick),
        ],
        'name': [
            (r'@[a-zA-Z0-9_.]+', Name.Decorator),
            ('[a-zA-Z_][a-zA-Z0-9_]*', Name),
        ],
        'funcname': [
            ('[a-zA-Z_][a-zA-Z0-9_]*', Name.Function, '#pop')
        ],
        'classname': [
            ('[a-zA-Z_][a-zA-Z0-9_]*', Name.Class, '#pop')
        ],
        'import': [
            (r'(?:[ \t]|\\\n)+', Text),
            (r'as\b', Keyword.Namespace),
            (r',', Operator),
            (r'[a-zA-Z_][a-zA-Z0-9_.]*', Name.Namespace),
            (r'', Text, '#pop') # all else: go back
        ],
        'fromimport': [
            (r'(?:[ \t]|\\\n)+', Text),
            (r'import\b', Keyword.Namespace, '#pop'),
            # if None occurs here, it's "raise x from None", since None can
            # never be a module name
            (r'None\b', Name.Builtin.Pseudo, '#pop'),
            # sadly, in "raise x from y" y will be highlighted as namespace too
            (r'[a-zA-Z_.][a-zA-Z0-9_.]*', Name.Namespace),
            # anything else here also means "raise x from y" and is therefore
            # not an error
            (r'', Text, '#pop'),
        ],
        'stringescape': [
            (r'\\([\\abfnrtv"\']|\n|N{.*?}|u[a-fA-F0-9]{4}|'
             r'U[a-fA-F0-9]{8}|x[a-fA-F0-9]{2}|[0-7]{1,3})', String.Escape)
        ],
        'strings': [
            (r'%(\([a-zA-Z0-9_]+\))?[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?'
             '[hlL]?[diouxXeEfFgGcrs%]', String.Interpol),
            (r'[^\\\'"%\n]+', String),
            # quotes, percents and backslashes must be parsed one at a time
            (r'[\'"\\]', String),
            # unhandled string formatting sign
            (r'%', String)
            # newlines are an error (use "nl" state)
        ],
        'nl': [
            (r'\n', String)
        ],
        'dqs': [
            (r'"', String, '#pop'),
            (r'\\\\|\\"|\\\n', String.Escape), # included here for raw strings
            include('strings')
        ],
        'sqs': [
            (r"'", String, '#pop'),
            (r"\\\\|\\'|\\\n", String.Escape), # included here for raw strings
            include('strings')
        ],
        'tdqs': [
            (r'"""', String, '#pop'),
            include('strings'),
            include('nl')
        ],
        'tsqs': [
            (r"'''", String, '#pop'),
            include('strings'),
            include('nl')
        ],
    }

    def analyse_text(text):
        return shebang_matches(text, r'pythonw?(2(\.\d)?)?') or \
            'import ' in text[:1000]


class Python3Lexer(RegexLexer):
    """
    For `Python <http://www.python.org>`_ source code (version 3.0).

    *New in Pygments 0.10.*
    """

    name = 'Python 3'
    aliases = ['python3', 'py3']
    filenames = []  # Nothing until Python 3 gets widespread
    mimetypes = ['text/x-python3', 'application/x-python3']

    flags = re.MULTILINE | re.UNICODE

    uni_name = "[%s][%s]*" % (uni.xid_start, uni.xid_continue)

    tokens = PythonLexer.tokens.copy()
    tokens['keywords'] = [
        (r'(assert|break|continue|del|elif|else|except|'
         r'finally|for|global|if|lambda|pass|raise|nonlocal|'
         r'return|try|while|yield(\s+from)?|as|with|True|False|None)\b',
         Keyword),
    ]
    tokens['builtins'] = [
        (r'(?<!\.)(__import__|abs|all|any|bin|bool|bytearray|bytes|'
         r'chr|classmethod|cmp|compile|complex|delattr|dict|dir|'
         r'divmod|enumerate|eval|filter|float|format|frozenset|getattr|'
         r'globals|hasattr|hash|hex|id|input|int|isinstance|issubclass|'
         r'iter|len|list|locals|map|max|memoryview|min|next|object|oct|'
         r'open|ord|pow|print|property|range|repr|reversed|round|'
         r'set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|'
         r'vars|zip)\b', Name.Builtin),
        (r'(?<!\.)(self|Ellipsis|NotImplemented)\b', Name.Builtin.Pseudo),
        (r'(?<!\.)(ArithmeticError|AssertionError|AttributeError|'
         r'BaseException|BufferError|BytesWarning|DeprecationWarning|'
         r'EOFError|EnvironmentError|Exception|FloatingPointError|'
         r'FutureWarning|GeneratorExit|IOError|ImportError|'
         r'ImportWarning|IndentationError|IndexError|KeyError|'
         r'KeyboardInterrupt|LookupError|MemoryError|NameError|'
         r'NotImplementedError|OSError|OverflowError|'
         r'PendingDeprecationWarning|ReferenceError|'
         r'RuntimeError|RuntimeWarning|StopIteration|'
         r'SyntaxError|SyntaxWarning|SystemError|SystemExit|TabError|'
         r'TypeError|UnboundLocalError|UnicodeDecodeError|'
         r'UnicodeEncodeError|UnicodeError|UnicodeTranslateError|'
         r'UnicodeWarning|UserWarning|ValueError|VMSError|Warning|'
         r'WindowsError|ZeroDivisionError|'
         # new builtin exceptions from PEP 3151
         r'BlockingIOError|ChildProcessError|ConnectionError|'
         r'BrokenPipeError|ConnectionAbortedError|ConnectionRefusedError|'
         r'ConnectionResetError|FileExistsError|FileNotFoundError|'
         r'InterruptedError|IsADirectoryError|NotADirectoryError|'
         r'PermissionError|ProcessLookupError|TimeoutError)\b',
         Name.Exception),
    ]
    tokens['numbers'] = [
        (r'(\d+\.\d*|\d*\.\d+)([eE][+-]?[0-9]+)?', Number.Float),
        (r'0[oO][0-7]+', Number.Oct),
        (r'0[bB][01]+', Number.Bin),
        (r'0[xX][a-fA-F0-9]+', Number.Hex),
        (r'\d+', Number.Integer)
    ]
    tokens['backtick'] = []
    tokens['name'] = [
        (r'@[a-zA-Z0-9_]+', Name.Decorator),
        (uni_name, Name),
    ]
    tokens['funcname'] = [
        (uni_name, Name.Function, '#pop')
    ]
    tokens['classname'] = [
        (uni_name, Name.Class, '#pop')
    ]
    tokens['import'] = [
        (r'(\s+)(as)(\s+)', bygroups(Text, Keyword, Text)),
        (r'\.', Name.Namespace),
        (uni_name, Name.Namespace),
        (r'(\s*)(,)(\s*)', bygroups(Text, Operator, Text)),
        (r'', Text, '#pop') # all else: go back
    ]
    tokens['fromimport'] = [
        (r'(\s+)(import)\b', bygroups(Text, Keyword), '#pop'),
        (r'\.', Name.Namespace),
        (uni_name, Name.Namespace),
        (r'', Text, '#pop'),
    ]
    # don't highlight "%s" substitutions
    tokens['strings'] = [
        (r'[^\\\'"%\n]+', String),
        # quotes, percents and backslashes must be parsed one at a time
        (r'[\'"\\]', String),
        # unhandled string formatting sign
        (r'%', String)
        # newlines are an error (use "nl" state)
    ]

    def analyse_text(text):
        return shebang_matches(text, r'pythonw?3(\.\d)?')


class PythonConsoleLexer(Lexer):
    """
    For Python console output or doctests, such as:

    .. sourcecode:: pycon

        >>> a = 'foo'
        >>> print a
        foo
        >>> 1 / 0
        Traceback (most recent call last):
          File "<stdin>", line 1, in <module>
        ZeroDivisionError: integer division or modulo by zero

    Additional options:

    `python3`
        Use Python 3 lexer for code.  Default is ``False``.
        *New in Pygments 1.0.*
    """
    name = 'Python console session'
    aliases = ['pycon']
    mimetypes = ['text/x-python-doctest']

    def __init__(self, **options):
        self.python3 = get_bool_opt(options, 'python3', False)
        Lexer.__init__(self, **options)

    def get_tokens_unprocessed(self, text):
        if self.python3:
            pylexer = Python3Lexer(**self.options)
            tblexer = Python3TracebackLexer(**self.options)
        else:
            pylexer = PythonLexer(**self.options)
            tblexer = PythonTracebackLexer(**self.options)

        curcode = ''
        insertions = []
        curtb = ''
        tbindex = 0
        tb = 0
        for match in line_re.finditer(text):
            line = match.group()
            if line.startswith('>>> ') or line.startswith('... '):
                tb = 0
                insertions.append((len(curcode),
                                   [(0, Generic.Prompt, line[:4])]))
                curcode += line[4:]
            elif line.rstrip() == '...' and not tb:
                # only a new >>> prompt can end an exception block
                # otherwise an ellipsis in place of the traceback frames
                # will be mishandled
                insertions.append((len(curcode),
                                   [(0, Generic.Prompt, '...')]))
                curcode += line[3:]
            else:
                if curcode:
                    for item in do_insertions(insertions,
                                    pylexer.get_tokens_unprocessed(curcode)):
                        yield item
                    curcode = ''
                    insertions = []
                if (line.startswith('Traceback (most recent call last):') or
                    re.match(r'  File "[^"]+", line \d+\n$', line)):
                    tb = 1
                    curtb = line
                    tbindex = match.start()
                elif line == 'KeyboardInterrupt\n':
                    yield match.start(), Name.Class, line
                elif tb:
                    curtb += line
                    if not (line.startswith(' ') or line.strip() == '...'):
                        tb = 0
                        for i, t, v in tblexer.get_tokens_unprocessed(curtb):
                            yield tbindex+i, t, v
                else:
                    yield match.start(), Generic.Output, line
        if curcode:
            for item in do_insertions(insertions,
                                      pylexer.get_tokens_unprocessed(curcode)):
                yield item


class PythonTracebackLexer(RegexLexer):
    """
    For Python tracebacks.

    *New in Pygments 0.7.*
    """

    name = 'Python Traceback'
    aliases = ['pytb']
    filenames = ['*.pytb']
    mimetypes = ['text/x-python-traceback']

    tokens = {
        'root': [
            (r'^Traceback \(most recent call last\):\n',
             Generic.Traceback, 'intb'),
            # SyntaxError starts with this.
            (r'^(?=  File "[^"]+", line \d+)', Generic.Traceback, 'intb'),
            (r'^.*\n', Other),
        ],
        'intb': [
            (r'^(  File )("[^"]+")(, line )(\d+)(, in )(.+)(\n)',
             bygroups(Text, Name.Builtin, Text, Number, Text, Name, Text)),
            (r'^(  File )("[^"]+")(, line )(\d+)(\n)',
             bygroups(Text, Name.Builtin, Text, Number, Text)),
            (r'^(    )(.+)(\n)',
             bygroups(Text, using(PythonLexer), Text)),
            (r'^([ \t]*)(\.\.\.)(\n)',
             bygroups(Text, Comment, Text)), # for doctests...
            (r'^([^:]+)(: )(.+)(\n)',
             bygroups(Generic.Error, Text, Name, Text), '#pop'),
            (r'^([a-zA-Z_][a-zA-Z0-9_]*)(:?\n)',
             bygroups(Generic.Error, Text), '#pop')
        ],
    }


class Python3TracebackLexer(RegexLexer):
    """
    For Python 3.0 tracebacks, with support for chained exceptions.

    *New in Pygments 1.0.*
    """

    name = 'Python 3.0 Traceback'
    aliases = ['py3tb']
    filenames = ['*.py3tb']
    mimetypes = ['text/x-python3-traceback']

    tokens = {
        'root': [
            (r'\n', Text),
            (r'^Traceback \(most recent call last\):\n', Generic.Traceback, 'intb'),
            (r'^During handling of the above exception, another '
             r'exception occurred:\n\n', Generic.Traceback),
            (r'^The above exception was the direct cause of the '
             r'following exception:\n\n', Generic.Traceback),
            (r'^(?=  File "[^"]+", line \d+)', Generic.Traceback, 'intb'),
        ],
        'intb': [
            (r'^(  File )("[^"]+")(, line )(\d+)(, in )(.+)(\n)',
             bygroups(Text, Name.Builtin, Text, Number, Text, Name, Text)),
            (r'^(  File )("[^"]+")(, line )(\d+)(\n)',
             bygroups(Text, Name.Builtin, Text, Number, Text)),
            (r'^(    )(.+)(\n)',
             bygroups(Text, using(Python3Lexer), Text)),
            (r'^([ \t]*)(\.\.\.)(\n)',
             bygroups(Text, Comment, Text)), # for doctests...
            (r'^([^:]+)(: )(.+)(\n)',
             bygroups(Generic.Error, Text, Name, Text), '#pop'),
            (r'^([a-zA-Z_][a-zA-Z0-9_]*)(:?\n)',
             bygroups(Generic.Error, Text), '#pop')
        ],
    }


class RubyLexer(ExtendedRegexLexer):
    """
    For `Ruby <http://www.ruby-lang.org>`_ source code.
    """

    name = 'Ruby'
    aliases = ['rb', 'ruby', 'duby']
    filenames = ['*.rb', '*.rbw', 'Rakefile', '*.rake', '*.gemspec',
                 '*.rbx', '*.duby']
    mimetypes = ['text/x-ruby', 'application/x-ruby']

    flags = re.DOTALL | re.MULTILINE

    def heredoc_callback(self, match, ctx):
        # okay, this is the hardest part of parsing Ruby...
        # match: 1 = <<-?, 2 = quote? 3 = name 4 = quote? 5 = rest of line

        start = match.start(1)
        yield start, Operator, match.group(1)        # <<-?
        yield match.start(2), String.Heredoc, match.group(2)  # quote ", ', `
        yield match.start(3), Name.Constant, match.group(3)   # heredoc name
        yield match.start(4), String.Heredoc, match.group(4)  # quote again

        heredocstack = ctx.__dict__.setdefault('heredocstack', [])
        outermost = not bool(heredocstack)
        heredocstack.append((match.group(1) == '<<-', match.group(3)))

        ctx.pos = match.start(5)
        ctx.end = match.end(5)
        # this may find other heredocs
        for i, t, v in self.get_tokens_unprocessed(context=ctx):
            yield i, t, v
        ctx.pos = match.end()

        if outermost:
            # this is the outer heredoc again, now we can process them all
            for tolerant, hdname in heredocstack:
                lines = []
                for match in line_re.finditer(ctx.text, ctx.pos):
                    if tolerant:
                        check = match.group().strip()
                    else:
                        check = match.group().rstrip()
                    if check == hdname:
                        for amatch in lines:
                            yield amatch.start(), String.Heredoc, amatch.group()
                        yield match.start(), Name.Constant, match.group()
                        ctx.pos = match.end()
                        break
                    else:
                        lines.append(match)
                else:
                    # end of heredoc not found -- error!
                    for amatch in lines:
                        yield amatch.start(), Error, amatch.group()
            ctx.end = len(ctx.text)
            del heredocstack[:]


    def gen_rubystrings_rules():
        def intp_regex_callback(self, match, ctx):
            yield match.start(1), String.Regex, match.group(1)  # begin
            nctx = LexerContext(match.group(3), 0, ['interpolated-regex'])
            for i, t, v in self.get_tokens_unprocessed(context=nctx):
                yield match.start(3)+i, t, v
            yield match.start(4), String.Regex, match.group(4)  # end[mixounse]*
            ctx.pos = match.end()

        def intp_string_callback(self, match, ctx):
            yield match.start(1), String.Other, match.group(1)
            nctx = LexerContext(match.group(3), 0, ['interpolated-string'])
            for i, t, v in self.get_tokens_unprocessed(context=nctx):
                yield match.start(3)+i, t, v
            yield match.start(4), String.Other, match.group(4)  # end
            ctx.pos = match.end()

        states = {}
        states['strings'] = [
            # easy ones
            (r'\:@{0,2}([a-zA-Z_]\w*[\!\?]?|\*\*?|[-+]@?|'
             r'[/%&|^`~]|\[\]=?|<<|>>|<=?>|>=?|===?)', String.Symbol),
            (r":'(\\\\|\\'|[^'])*'", String.Symbol),
            (r"'(\\\\|\\'|[^'])*'", String.Single),
            (r':"', String.Symbol, 'simple-sym'),
            (r'([a-zA-Z_][a-zA-Z0-9]*)(:)(?!:)',
             bygroups(String.Symbol, Punctuation)),  # Since Ruby 1.9
            (r'"', String.Double, 'simple-string'),
            (r'(?<!\.)`', String.Backtick, 'simple-backtick'),
        ]

        # double-quoted string and symbol
        for name, ttype, end in ('string', String.Double, '"'), \
                                ('sym', String.Symbol, '"'), \
                                ('backtick', String.Backtick, '`'):
            states['simple-'+name] = [
                include('string-intp-escaped'),
                (r'[^\\%s#]+' % end, ttype),
                (r'[\\#]', ttype),
                (end, ttype, '#pop'),
            ]

        # braced quoted strings
        for lbrace, rbrace, name in ('\\{', '\\}', 'cb'), \
                                    ('\\[', '\\]', 'sb'), \
                                    ('\\(', '\\)', 'pa'), \
                                    ('<', '>', 'ab'):
            states[name+'-intp-string'] = [
                (r'\\[\\' + lbrace + rbrace + ']', String.Other),
                (r'(?<!\\)' + lbrace, String.Other, '#push'),
                (r'(?<!\\)' + rbrace, String.Other, '#pop'),
                include('string-intp-escaped'),
                (r'[\\#' + lbrace + rbrace + ']', String.Other),
                (r'[^\\#' + lbrace + rbrace + ']+', String.Other),
            ]
            states['strings'].append((r'%[QWx]?' + lbrace, String.Other,
                                      name+'-intp-string'))
            states[name+'-string'] = [
                (r'\\[\\' + lbrace + rbrace + ']', String.Other),
                (r'(?<!\\)' + lbrace, String.Other, '#push'),
                (r'(?<!\\)' + rbrace, String.Other, '#pop'),
                (r'[\\#' + lbrace + rbrace + ']', String.Other),
                (r'[^\\#' + lbrace + rbrace + ']+', String.Other),
            ]
            states['strings'].append((r'%[qsw]' + lbrace, String.Other,
                                      name+'-string'))
            states[name+'-regex'] = [
                (r'\\[\\' + lbrace + rbrace + ']', String.Regex),
                (r'(?<!\\)' + lbrace, String.Regex, '#push'),
                (r'(?<!\\)' + rbrace + '[mixounse]*', String.Regex, '#pop'),
                include('string-intp'),
                (r'[\\#' + lbrace + rbrace + ']', String.Regex),
                (r'[^\\#' + lbrace + rbrace + ']+', String.Regex),
            ]
            states['strings'].append((r'%r' + lbrace, String.Regex,
                                      name+'-regex'))

        # these must come after %<brace>!
        states['strings'] += [
            # %r regex
            (r'(%r([^a-zA-Z0-9]))((?:\\\2|(?!\2).)*)(\2[mixounse]*)',
             intp_regex_callback),
            # regular fancy strings with qsw
            (r'%[qsw]([^a-zA-Z0-9])((?:\\\1|(?!\1).)*)\1', String.Other),
            (r'(%[QWx]([^a-zA-Z0-9]))((?:\\\2|(?!\2).)*)(\2)',
             intp_string_callback),
            # special forms of fancy strings after operators or
            # in method calls with braces
            (r'(?<=[-+/*%=<>&!^|~,(])(\s*)(%([\t ])(?:(?:\\\3|(?!\3).)*)\3)',
             bygroups(Text, String.Other, None)),
            # and because of fixed width lookbehinds the whole thing a
            # second time for line startings...
            (r'^(\s*)(%([\t ])(?:(?:\\\3|(?!\3).)*)\3)',
             bygroups(Text, String.Other, None)),
            # all regular fancy strings without qsw
            (r'(%([^a-zA-Z0-9\s]))((?:\\\2|(?!\2).)*)(\2)',
             intp_string_callback),
        ]

        return states

    tokens = {
        'root': [
            (r'#.*?$', Comment.Single),
            (r'=begin\s.*?\n=end.*?$', Comment.Multiline),
            # keywords
            (r'(BEGIN|END|alias|begin|break|case|defined\?|'
             r'do|else|elsif|end|ensure|for|if|in|next|redo|'
             r'rescue|raise|retry|return|super|then|undef|unless|until|when|'
             r'while|yield)\b', Keyword),
            # start of function, class and module names
            (r'(module)(\s+)([a-zA-Z_][a-zA-Z0-9_]*'
             r'(?:::[a-zA-Z_][a-zA-Z0-9_]*)*)',
             bygroups(Keyword, Text, Name.Namespace)),
            (r'(def)(\s+)', bygroups(Keyword, Text), 'funcname'),
            (r'def(?=[*%&^`~+-/\[<>=])', Keyword, 'funcname'),
            (r'(class)(\s+)', bygroups(Keyword, Text), 'classname'),
            # special methods
            (r'(initialize|new|loop|include|extend|raise|attr_reader|'
             r'attr_writer|attr_accessor|attr|catch|throw|private|'
             r'module_function|public|protected|true|false|nil)\b',
             Keyword.Pseudo),
            (r'(not|and|or)\b', Operator.Word),
            (r'(autoload|block_given|const_defined|eql|equal|frozen|include|'
             r'instance_of|is_a|iterator|kind_of|method_defined|nil|'
             r'private_method_defined|protected_method_defined|'
             r'public_method_defined|respond_to|tainted)\?', Name.Builtin),
            (r'(chomp|chop|exit|gsub|sub)!', Name.Builtin),
            (r'(?<!\.)(Array|Float|Integer|String|__id__|__send__|abort|'
             r'ancestors|at_exit|autoload|binding|callcc|caller|'
             r'catch|chomp|chop|class_eval|class_variables|'
             r'clone|const_defined\?|const_get|const_missing|const_set|'
             r'constants|display|dup|eval|exec|exit|extend|fail|fork|'
             r'format|freeze|getc|gets|global_variables|gsub|'
             r'hash|id|included_modules|inspect|instance_eval|'
             r'instance_method|instance_methods|'
             r'instance_variable_get|instance_variable_set|instance_variables|'
             r'lambda|load|local_variables|loop|'
             r'method|method_missing|methods|module_eval|name|'
             r'object_id|open|p|print|printf|private_class_method|'
             r'private_instance_methods|'
             r'private_methods|proc|protected_instance_methods|'
             r'protected_methods|public_class_method|'
             r'public_instance_methods|public_methods|'
             r'putc|puts|raise|rand|readline|readlines|require|'
             r'scan|select|self|send|set_trace_func|singleton_methods|sleep|'
             r'split|sprintf|srand|sub|syscall|system|taint|'
             r'test|throw|to_a|to_s|trace_var|trap|untaint|untrace_var|'
             r'warn)\b', Name.Builtin),
            (r'__(FILE|LINE)__\b', Name.Builtin.Pseudo),
            # normal heredocs
            (r'(?<!\w)(<<-?)(["`\']?)([a-zA-Z_]\w*)(\2)(.*?\n)',
             heredoc_callback),
            # empty string heredocs
            (r'(<<-?)("|\')()(\2)(.*?\n)', heredoc_callback),
            (r'__END__', Comment.Preproc, 'end-part'),
            # multiline regex (after keywords or assignments)
            (r'(?:^|(?<=[=<>~!:])|'
                 r'(?<=(?:\s|;)when\s)|'
                 r'(?<=(?:\s|;)or\s)|'
                 r'(?<=(?:\s|;)and\s)|'
                 r'(?<=(?:\s|;|\.)index\s)|'
                 r'(?<=(?:\s|;|\.)scan\s)|'
                 r'(?<=(?:\s|;|\.)sub\s)|'
                 r'(?<=(?:\s|;|\.)sub!\s)|'
                 r'(?<=(?:\s|;|\.)gsub\s)|'
                 r'(?<=(?:\s|;|\.)gsub!\s)|'
                 r'(?<=(?:\s|;|\.)match\s)|'
                 r'(?<=(?:\s|;)if\s)|'
                 r'(?<=(?:\s|;)elsif\s)|'
                 r'(?<=^when\s)|'
                 r'(?<=^index\s)|'
                 r'(?<=^scan\s)|'
                 r'(?<=^sub\s)|'
                 r'(?<=^gsub\s)|'
                 r'(?<=^sub!\s)|'
                 r'(?<=^gsub!\s)|'
                 r'(?<=^match\s)|'
                 r'(?<=^if\s)|'
                 r'(?<=^elsif\s)'
             r')(\s*)(/)', bygroups(Text, String.Regex), 'multiline-regex'),
            # multiline regex (in method calls or subscripts)
            (r'(?<=\(|,|\[)/', String.Regex, 'multiline-regex'),
            # multiline regex (this time the funny no whitespace rule)
            (r'(\s+)(/)(?![\s=])', bygroups(Text, String.Regex),
             'multiline-regex'),
            # lex numbers and ignore following regular expressions which
            # are division operators in fact (grrrr. i hate that. any
            # better ideas?)
            # since pygments 0.7 we also eat a "?" operator after numbers
            # so that the char operator does not work. Chars are not allowed
            # there so that you can use the ternary operator.
            # stupid example:
            #   x>=0?n[x]:""
            (r'(0_?[0-7]+(?:_[0-7]+)*)(\s*)([/?])?',
             bygroups(Number.Oct, Text, Operator)),
            (r'(0x[0-9A-Fa-f]+(?:_[0-9A-Fa-f]+)*)(\s*)([/?])?',
             bygroups(Number.Hex, Text, Operator)),
            (r'(0b[01]+(?:_[01]+)*)(\s*)([/?])?',
             bygroups(Number.Bin, Text, Operator)),
            (r'([\d]+(?:_\d+)*)(\s*)([/?])?',
             bygroups(Number.Integer, Text, Operator)),
            # Names
            (r'@@[a-zA-Z_][a-zA-Z0-9_]*', Name.Variable.Class),
            (r'@[a-zA-Z_][a-zA-Z0-9_]*', Name.Variable.Instance),
            (r'\$[a-zA-Z0-9_]+', Name.Variable.Global),
            (r'\$[!@&`\'+~=/\\,;.<>_*$?:"]', Name.Variable.Global),
            (r'\$-[0adFiIlpvw]', Name.Variable.Global),
            (r'::', Operator),
            include('strings'),
            # chars
            (r'\?(\\[MC]-)*' # modifiers
             r'(\\([\\abefnrstv#"\']|x[a-fA-F0-9]{1,2}|[0-7]{1,3})|\S)'
             r'(?!\w)',
             String.Char),
            (r'[A-Z][a-zA-Z0-9_]+', Name.Constant),
            # this is needed because ruby attributes can look
            # like keywords (class) or like this: ` ?!?
            (r'(\.|::)([a-zA-Z_]\w*[\!\?]?|[*%&^`~+-/\[<>=])',
             bygroups(Operator, Name)),
            (r'[a-zA-Z_]\w*[\!\?]?', Name),
            (r'(\[|\]|\*\*|<<?|>>?|>=|<=|<=>|=~|={3}|'
             r'!~|&&?|\|\||\.{1,3})', Operator),
            (r'[-+/*%=<>&!^|~]=?', Operator),
            (r'[(){};,/?:\\]', Punctuation),
            (r'\s+', Text)
        ],
        'funcname': [
            (r'\(', Punctuation, 'defexpr'),
            (r'(?:([a-zA-Z_][a-zA-Z0-9_]*)(\.))?'
             r'([a-zA-Z_]\w*[\!\?]?|\*\*?|[-+]@?|'
             r'[/%&|^`~]|\[\]=?|<<|>>|<=?>|>=?|===?)',
             bygroups(Name.Class, Operator, Name.Function), '#pop'),
            (r'', Text, '#pop')
        ],
        'classname': [
            (r'\(', Punctuation, 'defexpr'),
            (r'<<', Operator, '#pop'),
            (r'[A-Z_]\w*', Name.Class, '#pop'),
            (r'', Text, '#pop')
        ],
        'defexpr': [
            (r'(\))(\.|::)?', bygroups(Punctuation, Operator), '#pop'),
            (r'\(', Operator, '#push'),
            include('root')
        ],
        'in-intp': [
            ('}', String.Interpol, '#pop'),
            include('root'),
        ],
        'string-intp': [
            (r'#{', String.Interpol, 'in-intp'),
            (r'#@@?[a-zA-Z_][a-zA-Z0-9_]*', String.Interpol),
            (r'#\$[a-zA-Z_][a-zA-Z0-9_]*', String.Interpol)
        ],
        'string-intp-escaped': [
            include('string-intp'),
            (r'\\([\\abefnrstv#"\']|x[a-fA-F0-9]{1,2}|[0-7]{1,3})',
             String.Escape)
        ],
        'interpolated-regex': [
            include('string-intp'),
            (r'[\\#]', String.Regex),
            (r'[^\\#]+', String.Regex),
        ],
        'interpolated-string': [
            include('string-intp'),
            (r'[\\#]', String.Other),
            (r'[^\\#]+', String.Other),
        ],
        'multiline-regex': [
            include('string-intp'),
            (r'\\\\', String.Regex),
            (r'\\/', String.Regex),
            (r'[\\#]', String.Regex),
            (r'[^\\/#]+', String.Regex),
            (r'/[mixounse]*', String.Regex, '#pop'),
        ],
        'end-part': [
            (r'.+', Comment.Preproc, '#pop')
        ]
    }
    tokens.update(gen_rubystrings_rules())

    def analyse_text(text):
        return shebang_matches(text, r'ruby(1\.\d)?')


class RubyConsoleLexer(Lexer):
    """
    For Ruby interactive console (**irb**) output like:

    .. sourcecode:: rbcon

        irb(main):001:0> a = 1
        => 1
        irb(main):002:0> puts a
        1
        => nil
    """
    name = 'Ruby irb session'
    aliases = ['rbcon', 'irb']
    mimetypes = ['text/x-ruby-shellsession']

    _prompt_re = re.compile('irb\([a-zA-Z_][a-zA-Z0-9_]*\):\d{3}:\d+[>*"\'] '
                            '|>> |\?> ')

    def get_tokens_unprocessed(self, text):
        rblexer = RubyLexer(**self.options)

        curcode = ''
        insertions = []
        for match in line_re.finditer(text):
            line = match.group()
            m = self._prompt_re.match(line)
            if m is not None:
                end = m.end()
                insertions.append((len(curcode),
                                   [(0, Generic.Prompt, line[:end])]))
                curcode += line[end:]
            else:
                if curcode:
                    for item in do_insertions(insertions,
                                    rblexer.get_tokens_unprocessed(curcode)):
                        yield item
                    curcode = ''
                    insertions = []
                yield match.start(), Generic.Output, line
        if curcode:
            for item in do_insertions(insertions,
                                      rblexer.get_tokens_unprocessed(curcode)):
                yield item


class PerlLexer(RegexLexer):
    """
    For `Perl <http://www.perl.org>`_ source code.
    """

    name = 'Perl'
    aliases = ['perl', 'pl']
    filenames = ['*.pl', '*.pm']
    mimetypes = ['text/x-perl', 'application/x-perl']

    flags = re.DOTALL | re.MULTILINE
    # TODO: give this to a perl guy who knows how to parse perl...
    tokens = {
        'balanced-regex': [
            (r'/(\\\\|\\[^\\]|[^\\/])*/[egimosx]*', String.Regex, '#pop'),
            (r'!(\\\\|\\[^\\]|[^\\!])*![egimosx]*', String.Regex, '#pop'),
            (r'\\(\\\\|[^\\])*\\[egimosx]*', String.Regex, '#pop'),
            (r'{(\\\\|\\[^\\]|[^\\}])*}[egimosx]*', String.Regex, '#pop'),
            (r'<(\\\\|\\[^\\]|[^\\>])*>[egimosx]*', String.Regex, '#pop'),
            (r'\[(\\\\|\\[^\\]|[^\\\]])*\][egimosx]*', String.Regex, '#pop'),
            (r'\((\\\\|\\[^\\]|[^\\\)])*\)[egimosx]*', String.Regex, '#pop'),
            (r'@(\\\\|\\[^\\]|[^\\\@])*@[egimosx]*', String.Regex, '#pop'),
            (r'%(\\\\|\\[^\\]|[^\\\%])*%[egimosx]*', String.Regex, '#pop'),
            (r'\$(\\\\|\\[^\\]|[^\\\$])*\$[egimosx]*', String.Regex, '#pop'),
        ],
        'root': [
            (r'\#.*?$', Comment.Single),
            (r'^=[a-zA-Z0-9]+\s+.*?\n=cut', Comment.Multiline),
            (r'(case|continue|do|else|elsif|for|foreach|if|last|my|'
             r'next|our|redo|reset|then|unless|until|while|use|'
             r'print|new|BEGIN|CHECK|INIT|END|return)\b', Keyword),
            (r'(format)(\s+)([a-zA-Z0-9_]+)(\s*)(=)(\s*\n)',
             bygroups(Keyword, Text, Name, Text, Punctuation, Text), 'format'),
            (r'(eq|lt|gt|le|ge|ne|not|and|or|cmp)\b', Operator.Word),
            # common delimiters
            (r's/(\\\\|\\[^\\]|[^\\/])*/(\\\\|\\[^\\]|[^\\/])*/[egimosx]*',
                String.Regex),
            (r's!(\\\\|\\!|[^!])*!(\\\\|\\!|[^!])*![egimosx]*', String.Regex),
            (r's\\(\\\\|[^\\])*\\(\\\\|[^\\])*\\[egimosx]*', String.Regex),
            (r's@(\\\\|\\[^\\]|[^\\@])*@(\\\\|\\[^\\]|[^\\@])*@[egimosx]*',
                String.Regex),
            (r's%(\\\\|\\[^\\]|[^\\%])*%(\\\\|\\[^\\]|[^\\%])*%[egimosx]*',
                String.Regex),
            # balanced delimiters
            (r's{(\\\\|\\[^\\]|[^\\}])*}\s*', String.Regex, 'balanced-regex'),
            (r's<(\\\\|\\[^\\]|[^\\>])*>\s*', String.Regex, 'balanced-regex'),
            (r's\[(\\\\|\\[^\\]|[^\\\]])*\]\s*', String.Regex,
                'balanced-regex'),
            (r's\((\\\\|\\[^\\]|[^\\\)])*\)\s*', String.Regex,
                'balanced-regex'),

            (r'm?/(\\\\|\\[^\\]|[^\\/\n])*/[gcimosx]*', String.Regex),
            (r'm(?=[/!\\{<\[\(@%\$])', String.Regex, 'balanced-regex'),
            (r'((?<==~)|(?<=\())\s*/(\\\\|\\[^\\]|[^\\/])*/[gcimosx]*',
                String.Regex),
            (r'\s+', Text),
            (r'(abs|accept|alarm|atan2|bind|binmode|bless|caller|chdir|'
             r'chmod|chomp|chop|chown|chr|chroot|close|closedir|connect|'
             r'continue|cos|crypt|dbmclose|dbmopen|defined|delete|die|'
             r'dump|each|endgrent|endhostent|endnetent|endprotoent|'
             r'endpwent|endservent|eof|eval|exec|exists|exit|exp|fcntl|'
             r'fileno|flock|fork|format|formline|getc|getgrent|getgrgid|'
             r'getgrnam|gethostbyaddr|gethostbyname|gethostent|getlogin|'
             r'getnetbyaddr|getnetbyname|getnetent|getpeername|getpgrp|'
             r'getppid|getpriority|getprotobyname|getprotobynumber|'
             r'getprotoent|getpwent|getpwnam|getpwuid|getservbyname|'
             r'getservbyport|getservent|getsockname|getsockopt|glob|gmtime|'
             r'goto|grep|hex|import|index|int|ioctl|join|keys|kill|last|'
             r'lc|lcfirst|length|link|listen|local|localtime|log|lstat|'
             r'map|mkdir|msgctl|msgget|msgrcv|msgsnd|my|next|no|oct|open|'
             r'opendir|ord|our|pack|package|pipe|pop|pos|printf|'
             r'prototype|push|quotemeta|rand|read|readdir|'
             r'readline|readlink|readpipe|recv|redo|ref|rename|require|'
             r'reverse|rewinddir|rindex|rmdir|scalar|seek|seekdir|'
             r'select|semctl|semget|semop|send|setgrent|sethostent|setnetent|'
             r'setpgrp|setpriority|setprotoent|setpwent|setservent|'
             r'setsockopt|shift|shmctl|shmget|shmread|shmwrite|shutdown|'
             r'sin|sleep|socket|socketpair|sort|splice|split|sprintf|sqrt|'
             r'srand|stat|study|substr|symlink|syscall|sysopen|sysread|'
             r'sysseek|system|syswrite|tell|telldir|tie|tied|time|times|tr|'
             r'truncate|uc|ucfirst|umask|undef|unlink|unpack|unshift|untie|'
             r'utime|values|vec|wait|waitpid|wantarray|warn|write'
             r')\b', Name.Builtin),
            (r'((__(DATA|DIE|WARN)__)|(STD(IN|OUT|ERR)))\b', Name.Builtin.Pseudo),
            (r'<<([\'"]?)([a-zA-Z_][a-zA-Z0-9_]*)\1;?\n.*?\n\2\n', String),
            (r'__END__', Comment.Preproc, 'end-part'),
            (r'\$\^[ADEFHILMOPSTWX]', Name.Variable.Global),
            (r"\$[\\\"\[\]'&`+*.,;=%~?@$!<>(^|/-](?!\w)", Name.Variable.Global),
            (r'[$@%#]+', Name.Variable, 'varname'),
            (r'0_?[0-7]+(_[0-7]+)*', Number.Oct),
            (r'0x[0-9A-Fa-f]+(_[0-9A-Fa-f]+)*', Number.Hex),
            (r'0b[01]+(_[01]+)*', Number.Bin),
            (r'(?i)(\d*(_\d*)*\.\d+(_\d*)*|\d+(_\d*)*\.\d+(_\d*)*)(e[+-]?\d+)?',
             Number.Float),
            (r'(?i)\d+(_\d*)*e[+-]?\d+(_\d*)*', Number.Float),
            (r'\d+(_\d+)*', Number.Integer),
            (r"'(\\\\|\\[^\\]|[^'\\])*'", String),
            (r'"(\\\\|\\[^\\]|[^"\\])*"', String),
            (r'`(\\\\|\\[^\\]|[^`\\])*`', String.Backtick),
            (r'<([^\s>]+)>', String.Regex),
            (r'(q|qq|qw|qr|qx)\{', String.Other, 'cb-string'),
            (r'(q|qq|qw|qr|qx)\(', String.Other, 'rb-string'),
            (r'(q|qq|qw|qr|qx)\[', String.Other, 'sb-string'),
            (r'(q|qq|qw|qr|qx)\<', String.Other, 'lt-string'),
            (r'(q|qq|qw|qr|qx)([^a-zA-Z0-9])(.|\n)*?\2', String.Other),
            (r'package\s+', Keyword, 'modulename'),
            (r'sub\s+', Keyword, 'funcname'),
            (r'(\[\]|\*\*|::|<<|>>|>=|<=>|<=|={3}|!=|=~|'
             r'!~|&&?|\|\||\.{1,3})', Operator),
            (r'[-+/*%=<>&^|!\\~]=?', Operator),
            (r'[\(\)\[\]:;,<>/\?\{\}]', Punctuation), # yes, there's no shortage
                                                      # of punctuation in Perl!
            (r'(?=\w)', Name, 'name'),
        ],
        'format': [
            (r'\.\n', String.Interpol, '#pop'),
            (r'[^\n]*\n', String.Interpol),
        ],
        'varname': [
            (r'\s+', Text),
            (r'\{', Punctuation, '#pop'), # hash syntax?
            (r'\)|,', Punctuation, '#pop'), # argument specifier
            (r'[a-zA-Z0-9_]+::', Name.Namespace),
            (r'[a-zA-Z0-9_:]+', Name.Variable, '#pop'),
        ],
        'name': [
            (r'[a-zA-Z0-9_]+::', Name.Namespace),
            (r'[a-zA-Z0-9_:]+', Name, '#pop'),
            (r'[A-Z_]+(?=[^a-zA-Z0-9_])', Name.Constant, '#pop'),
            (r'(?=[^a-zA-Z0-9_])', Text, '#pop'),
        ],
        'modulename': [
            (r'[a-zA-Z_]\w*', Name.Namespace, '#pop')
        ],
        'funcname': [
            (r'[a-zA-Z_]\w*[\!\?]?', Name.Function),
            (r'\s+', Text),
            # argument declaration
            (r'(\([$@%]*\))(\s*)', bygroups(Punctuation, Text)),
            (r'.*?{', Punctuation, '#pop'),
            (r';', Punctuation, '#pop'),
        ],
        'cb-string': [
            (r'\\[\{\}\\]', String.Other),
            (r'\\', String.Other),
            (r'\{', String.Other, 'cb-string'),
            (r'\}', String.Other, '#pop'),
            (r'[^\{\}\\]+', String.Other)
        ],
        'rb-string': [
            (r'\\[\(\)\\]', String.Other),
            (r'\\', String.Other),
            (r'\(', String.Other, 'rb-string'),
            (r'\)', String.Other, '#pop'),
            (r'[^\(\)]+', String.Other)
        ],
        'sb-string': [
            (r'\\[\[\]\\]', String.Other),
            (r'\\', String.Other),
            (r'\[', String.Other, 'sb-string'),
            (r'\]', String.Other, '#pop'),
            (r'[^\[\]]+', String.Other)
        ],
        'lt-string': [
            (r'\\[\<\>\\]', String.Other),
            (r'\\', String.Other),
            (r'\<', String.Other, 'lt-string'),
            (r'\>', String.Other, '#pop'),
            (r'[^\<\>]+', String.Other)
        ],
        'end-part': [
            (r'.+', Comment.Preproc, '#pop')
        ]
    }

    def analyse_text(text):
        if shebang_matches(text, r'perl'):
            return True
        if 'my $' in text:
            return 0.9
        return 0.1 # who knows, might still be perl!


class LuaLexer(RegexLexer):
    """
    For `Lua <http://www.lua.org>`_ source code.

    Additional options accepted:

    `func_name_highlighting`
        If given and ``True``, highlight builtin function names
        (default: ``True``).
    `disabled_modules`
        If given, must be a list of module names whose function names
        should not be highlighted. By default all modules are highlighted.

        To get a list of allowed modules have a look into the
        `_luabuiltins` module:

        .. sourcecode:: pycon

            >>> from pygments.lexers._luabuiltins import MODULES
            >>> MODULES.keys()
            ['string', 'coroutine', 'modules', 'io', 'basic', ...]
    """

    name = 'Lua'
    aliases = ['lua']
    filenames = ['*.lua', '*.wlua']
    mimetypes = ['text/x-lua', 'application/x-lua']

    tokens = {
        'root': [
            # lua allows a file to start with a shebang
            (r'#!(.*?)$', Comment.Preproc),
            (r'', Text, 'base'),
        ],
        'base': [
            (r'(?s)--\[(=*)\[.*?\]\1\]', Comment.Multiline),
            ('--.*$', Comment.Single),

            (r'(?i)(\d*\.\d+|\d+\.\d*)(e[+-]?\d+)?', Number.Float),
            (r'(?i)\d+e[+-]?\d+', Number.Float),
            ('(?i)0x[0-9a-f]*', Number.Hex),
            (r'\d+', Number.Integer),

            (r'\n', Text),
            (r'[^\S\n]', Text),
            # multiline strings
            (r'(?s)\[(=*)\[.*?\]\1\]', String),

            (r'(==|~=|<=|>=|\.\.\.|\.\.|[=+\-*/%^<>#])', Operator),
            (r'[\[\]\{\}\(\)\.,:;]', Punctuation),
            (r'(and|or|not)\b', Operator.Word),

            ('(break|do|else|elseif|end|for|if|in|repeat|return|then|until|'
             r'while)\b', Keyword),
            (r'(local)\b', Keyword.Declaration),
            (r'(true|false|nil)\b', Keyword.Constant),

            (r'(function)\b', Keyword, 'funcname'),

            (r'[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)?', Name),

            ("'", String.Single, combined('stringescape', 'sqs')),
            ('"', String.Double, combined('stringescape', 'dqs'))
        ],

        'funcname': [
            (r'\s+', Text),
            ('(?:([A-Za-z_][A-Za-z0-9_]*)(\.))?([A-Za-z_][A-Za-z0-9_]*)',
             bygroups(Name.Class, Punctuation, Name.Function), '#pop'),
            # inline function
            ('\(', Punctuation, '#pop'),
        ],

        # if I understand correctly, every character is valid in a lua string,
        # so this state is only for later corrections
        'string': [
            ('.', String)
        ],

        'stringescape': [
            (r'''\\([abfnrtv\\"']|\d{1,3})''', String.Escape)
        ],

        'sqs': [
            ("'", String, '#pop'),
            include('string')
        ],

        'dqs': [
            ('"', String, '#pop'),
            include('string')
        ]
    }

    def __init__(self, **options):
        self.func_name_highlighting = get_bool_opt(
            options, 'func_name_highlighting', True)
        self.disabled_modules = get_list_opt(options, 'disabled_modules', [])

        self._functions = set()
        if self.func_name_highlighting:
            from pygments.lexers._luabuiltins import MODULES
            for mod, func in MODULES.items():
                if mod not in self.disabled_modules:
                    self._functions.update(func)
        RegexLexer.__init__(self, **options)

    def get_tokens_unprocessed(self, text):
        for index, token, value in \
            RegexLexer.get_tokens_unprocessed(self, text):
            if token is Name:
                if value in self._functions:
                    yield index, Name.Builtin, value
                    continue
                elif '.' in value:
                    a, b = value.split('.')
                    yield index, Name, a
                    yield index + len(a), Punctuation, '.'
                    yield index + len(a) + 1, Name, b
                    continue
            yield index, token, value


class MoonScriptLexer(LuaLexer):
    """
    For `MoonScript <http://moonscript.org.org>`_ source code.

    *New in Pygments 1.5.*
    """

    name = "MoonScript"
    aliases = ["moon", "moonscript"]
    filenames = ["*.moon"]
    mimetypes = ['text/x-moonscript', 'application/x-moonscript']

    tokens = {
        'root': [
            (r'#!(.*?)$', Comment.Preproc),
            (r'', Text, 'base'),
        ],
        'base': [
            ('--.*$', Comment.Single),
            (r'(?i)(\d*\.\d+|\d+\.\d*)(e[+-]?\d+)?', Number.Float),
            (r'(?i)\d+e[+-]?\d+', Number.Float),
            (r'(?i)0x[0-9a-f]*', Number.Hex),
            (r'\d+', Number.Integer),
            (r'\n', Text),
            (r'[^\S\n]+', Text),
            (r'(?s)\[(=*)\[.*?\]\1\]', String),
            (r'(->|=>)', Name.Function),
            (r':[a-zA-Z_][a-zA-Z0-9_]*', Name.Variable),
            (r'(==|!=|~=|<=|>=|\.\.\.|\.\.|[=+\-*/%^<>#!.\\:])', Operator),
            (r'[;,]', Punctuation),
            (r'[\[\]\{\}\(\)]', Keyword.Type),
            (r'[a-zA-Z_][a-zA-Z0-9_]*:', Name.Variable),
            (r"(class|extends|if|then|super|do|with|import|export|"
             r"while|elseif|return|for|in|from|when|using|else|"
             r"and|or|not|switch|break)\b", Keyword),
            (r'(true|false|nil)\b', Keyword.Constant),
            (r'(and|or|not)\b', Operator.Word),
            (r'(self)\b', Name.Builtin.Pseudo),
            (r'@@?([a-zA-Z_][a-zA-Z0-9_]*)?', Name.Variable.Class),
            (r'[A-Z]\w*', Name.Class), # proper name
            (r'[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)?', Name),
            ("'", String.Single, combined('stringescape', 'sqs')),
            ('"', String.Double, combined('stringescape', 'dqs'))
        ],
        'stringescape': [
            (r'''\\([abfnrtv\\"']|\d{1,3})''', String.Escape)
        ],
        'sqs': [
            ("'", String.Single, '#pop'),
            (".", String)
        ],
        'dqs': [
            ('"', String.Double, '#pop'),
            (".", String)
        ]
    }

    def get_tokens_unprocessed(self, text):
        # set . as Operator instead of Punctuation
        for index, token, value in \
            LuaLexer.get_tokens_unprocessed(self, text):
            if token == Punctuation and value == ".":
                token = Operator
            yield index, token, value


class CrocLexer(RegexLexer):
    """
    For `Croc <http://jfbillingsley.com/croc>`_ source.
    """
    name = 'Croc'
    filenames = ['*.croc']
    aliases = ['croc']
    mimetypes = ['text/x-crocsrc']

    tokens = {
        'root': [
            (r'\n', Text),
            (r'\s+', Text),
            # Comments
            (r'//(.*?)\n', Comment.Single),
            (r'/\*', Comment.Multiline, 'nestedcomment'),
            # Keywords
            (r'(as|assert|break|case|catch|class|continue|default'
             r'|do|else|finally|for|foreach|function|global|namespace'
             r'|if|import|in|is|local|module|return|scope|super|switch'
             r'|this|throw|try|vararg|while|with|yield)\b', Keyword),
            (r'(false|true|null)\b', Keyword.Constant),
            # FloatLiteral
            (r'([0-9][0-9_]*)(?=[.eE])(\.[0-9][0-9_]*)?([eE][+\-]?[0-9_]+)?',
             Number.Float),
            # IntegerLiteral
            # -- Binary
            (r'0[bB][01][01_]*', Number),
            # -- Hexadecimal
            (r'0[xX][0-9a-fA-F][0-9a-fA-F_]*', Number.Hex),
            # -- Decimal
            (r'([0-9][0-9_]*)(?![.eE])', Number.Integer),
            # CharacterLiteral
            (r"""'(\\['"\\nrt]|\\x[0-9a-fA-F]{2}|\\[0-9]{1,3}"""
             r"""|\\u[0-9a-fA-F]{4}|\\U[0-9a-fA-F]{8}|.)'""",
             String.Char
            ),
            # StringLiteral
            # -- WysiwygString
            (r'@"(""|[^"])*"', String),
            (r'@`(``|[^`])*`', String),
            (r"@'(''|[^'])*'", String),
            # -- DoubleQuotedString
            (r'"(\\\\|\\"|[^"])*"', String),
            # Tokens
            (
             r'(~=|\^=|%=|\*=|==|!=|>>>=|>>>|>>=|>>|>=|<=>|\?=|-\>'
             r'|<<=|<<|<=|\+\+|\+=|--|-=|\|\||\|=|&&|&=|\.\.|/=)'
             r'|[-/.&$@|\+<>!()\[\]{}?,;:=*%^~#\\]', Punctuation
            ),
            # Identifier
            (r'[a-zA-Z_]\w*', Name),
        ],
        'nestedcomment': [
            (r'[^*/]+', Comment.Multiline),
            (r'/\*', Comment.Multiline, '#push'),
            (r'\*/', Comment.Multiline, '#pop'),
            (r'[*/]', Comment.Multiline),
        ],
    }


class MiniDLexer(CrocLexer):
    """
    For MiniD source. MiniD is now known as Croc.
    """
    name = 'MiniD'
    filenames = ['*.md']
    aliases = ['minid']
    mimetypes = ['text/x-minidsrc']


class IoLexer(RegexLexer):
    """
    For `Io <http://iolanguage.com/>`_ (a small, prototype-based
    programming language) source.

    *New in Pygments 0.10.*
    """
    name = 'Io'
    filenames = ['*.io']
    aliases = ['io']
    mimetypes = ['text/x-iosrc']
    tokens = {
        'root': [
            (r'\n', Text),
            (r'\s+', Text),
            # Comments
            (r'//(.*?)\n', Comment.Single),
            (r'#(.*?)\n', Comment.Single),
            (r'/(\\\n)?[*](.|\n)*?[*](\\\n)?/', Comment.Multiline),
            (r'/\+', Comment.Multiline, 'nestedcomment'),
            # DoubleQuotedString
            (r'"(\\\\|\\"|[^"])*"', String),
            # Operators
            (r'::=|:=|=|\(|\)|;|,|\*|-|\+|>|<|@|!|/|\||\^|\.|%|&|\[|\]|\{|\}',
             Operator),
            # keywords
            (r'(clone|do|doFile|doString|method|for|if|else|elseif|then)\b',
             Keyword),
            # constants
            (r'(nil|false|true)\b', Name.Constant),
            # names
            (r'(Object|list|List|Map|args|Sequence|Coroutine|File)\b',
             Name.Builtin),
            ('[a-zA-Z_][a-zA-Z0-9_]*', Name),
            # numbers
            (r'(\d+\.?\d*|\d*\.\d+)([eE][+-]?[0-9]+)?', Number.Float),
            (r'\d+', Number.Integer)
        ],
        'nestedcomment': [
            (r'[^+/]+', Comment.Multiline),
            (r'/\+', Comment.Multiline, '#push'),
            (r'\+/', Comment.Multiline, '#pop'),
            (r'[+/]', Comment.Multiline),
        ]
    }


class TclLexer(RegexLexer):
    """
    For Tcl source code.

    *New in Pygments 0.10.*
    """

    keyword_cmds_re = (
        r'\b(after|apply|array|break|catch|continue|elseif|else|error|'
        r'eval|expr|for|foreach|global|if|namespace|proc|rename|return|'
        r'set|switch|then|trace|unset|update|uplevel|upvar|variable|'
        r'vwait|while)\b'
        )

    builtin_cmds_re = (
        r'\b(append|bgerror|binary|cd|chan|clock|close|concat|dde|dict|'
        r'encoding|eof|exec|exit|fblocked|fconfigure|fcopy|file|'
        r'fileevent|flush|format|gets|glob|history|http|incr|info|interp|'
        r'join|lappend|lassign|lindex|linsert|list|llength|load|loadTk|'
        r'lrange|lrepeat|lreplace|lreverse|lsearch|lset|lsort|mathfunc|'
        r'mathop|memory|msgcat|open|package|pid|pkg::create|pkg_mkIndex|'
        r'platform|platform::shell|puts|pwd|re_syntax|read|refchan|'
        r'regexp|registry|regsub|scan|seek|socket|source|split|string|'
        r'subst|tell|time|tm|unknown|unload)\b'
        )

    name = 'Tcl'
    aliases = ['tcl']
    filenames = ['*.tcl']
    mimetypes = ['text/x-tcl', 'text/x-script.tcl', 'application/x-tcl']

    def _gen_command_rules(keyword_cmds_re, builtin_cmds_re, context=""):
        return [
            (keyword_cmds_re, Keyword, 'params' + context),
            (builtin_cmds_re, Name.Builtin, 'params' + context),
            (r'([\w\.\-]+)', Name.Variable, 'params' + context),
            (r'#', Comment, 'comment'),
        ]

    tokens = {
        'root': [
            include('command'),
            include('basic'),
            include('data'),
            (r'}', Keyword),  # HACK: somehow we miscounted our braces
        ],
        'command': _gen_command_rules(keyword_cmds_re, builtin_cmds_re),
        'command-in-brace': _gen_command_rules(keyword_cmds_re,
                                               builtin_cmds_re,
                                               "-in-brace"),
        'command-in-bracket': _gen_command_rules(keyword_cmds_re,
                                                 builtin_cmds_re,
                                                 "-in-bracket"),
        'command-in-paren': _gen_command_rules(keyword_cmds_re,
                                               builtin_cmds_re,
                                               "-in-paren"),
        'basic': [
            (r'\(', Keyword, 'paren'),
            (r'\[', Keyword, 'bracket'),
            (r'\{', Keyword, 'brace'),
            (r'"', String.Double, 'string'),
            (r'(eq|ne|in|ni)\b', Operator.Word),
            (r'!=|==|<<|>>|<=|>=|&&|\|\||\*\*|[-+~!*/%<>&^|?:]', Operator),
        ],
        'data': [
            (r'\s+', Text),
            (r'0x[a-fA-F0-9]+', Number.Hex),
            (r'0[0-7]+', Number.Oct),
            (r'\d+\.\d+', Number.Float),
            (r'\d+', Number.Integer),
            (r'\$([\w\.\-\:]+)', Name.Variable),
            (r'([\w\.\-\:]+)', Text),
        ],
        'params': [
            (r';', Keyword, '#pop'),
            (r'\n', Text, '#pop'),
            (r'(else|elseif|then)\b', Keyword),
            include('basic'),
            include('data'),
        ],
        'params-in-brace': [
            (r'}', Keyword, ('#pop', '#pop')),
            include('params')
        ],
        'params-in-paren': [
            (r'\)', Keyword, ('#pop', '#pop')),
            include('params')
        ],
        'params-in-bracket': [
            (r'\]', Keyword, ('#pop', '#pop')),
            include('params')
        ],
        'string': [
            (r'\[', String.Double, 'string-square'),
            (r'(?s)(\\\\|\\[0-7]+|\\.|[^"\\])', String.Double),
            (r'"', String.Double, '#pop')
        ],
        'string-square': [
            (r'\[', String.Double, 'string-square'),
            (r'(?s)(\\\\|\\[0-7]+|\\.|\\\n|[^\]\\])', String.Double),
            (r'\]', String.Double, '#pop')
        ],
        'brace': [
            (r'}', Keyword, '#pop'),
            include('command-in-brace'),
            include('basic'),
            include('data'),
        ],
        'paren': [
            (r'\)', Keyword, '#pop'),
            include('command-in-paren'),
            include('basic'),
            include('data'),
        ],
        'bracket': [
            (r'\]', Keyword, '#pop'),
            include('command-in-bracket'),
            include('basic'),
            include('data'),
        ],
        'comment': [
            (r'.*[^\\]\n', Comment, '#pop'),
            (r'.*\\\n', Comment),
        ],
    }

    def analyse_text(text):
        return shebang_matches(text, r'(tcl)')


class FactorLexer(RegexLexer):
    """
    Lexer for the `Factor <http://factorcode.org>`_ language.

    *New in Pygments 1.4.*
    """
    name = 'Factor'
    aliases = ['factor']
    filenames = ['*.factor']
    mimetypes = ['text/x-factor']

    flags = re.MULTILINE | re.UNICODE

    builtin_kernel = (
        r'(?:or|2bi|2tri|while|wrapper|nip|4dip|wrapper\\?|bi\\*|'
        r'callstack>array|both\\?|hashcode|die|dupd|callstack|'
        r'callstack\\?|3dup|tri@|pick|curry|build|\\?execute|3bi|'
        r'prepose|>boolean|\\?if|clone|eq\\?|tri\\*|\\?|=|swapd|'
        r'2over|2keep|3keep|clear|2dup|when|not|tuple\\?|dup|2bi\\*|'
        r'2tri\\*|call|tri-curry|object|bi@|do|unless\\*|if\\*|loop|'
        r'bi-curry\\*|drop|when\\*|assert=|retainstack|assert\\?|-rot|'
        r'execute|2bi@|2tri@|boa|with|either\\?|3drop|bi|curry\\?|'
        r'datastack|until|3dip|over|3curry|tri-curry\\*|tri-curry@|swap|'
        r'and|2nip|throw|bi-curry|\\(clone\\)|hashcode\\*|compose|2dip|if|3tri|'
        r'unless|compose\\?|tuple|keep|2curry|equal\\?|assert|tri|2drop|'
        r'most|<wrapper>|boolean\\?|identity-hashcode|identity-tuple\\?|'
        r'null|new|dip|bi-curry@|rot|xor|identity-tuple|boolean)\s'
        )

    builtin_assocs = (
        r'(?:\\?at|assoc\\?|assoc-clone-like|assoc=|delete-at\\*|'
        r'assoc-partition|extract-keys|new-assoc|value\\?|assoc-size|'
        r'map>assoc|push-at|assoc-like|key\\?|assoc-intersect|'
        r'assoc-refine|update|assoc-union|assoc-combine|at\\*|'
        r'assoc-empty\\?|at\\+|set-at|assoc-all\\?|assoc-subset\\?|'
        r'assoc-hashcode|change-at|assoc-each|assoc-diff|zip|values|'
        r'value-at|rename-at|inc-at|enum\\?|at|cache|assoc>map|<enum>|'
        r'assoc|assoc-map|enum|value-at\\*|assoc-map-as|>alist|'
        r'assoc-filter-as|clear-assoc|assoc-stack|maybe-set-at|'
        r'substitute|assoc-filter|2cache|delete-at|assoc-find|keys|'
        r'assoc-any\\?|unzip)\s'
        )

    builtin_combinators = (
        r'(?:case|execute-effect|no-cond|no-case\\?|3cleave>quot|2cleave|'
        r'cond>quot|wrong-values\\?|no-cond\\?|cleave>quot|no-case|'
        r'case>quot|3cleave|wrong-values|to-fixed-point|alist>quot|'
        r'case-find|cond|cleave|call-effect|2cleave>quot|recursive-hashcode|'
        r'linear-case-quot|spread|spread>quot)\s'
        )

    builtin_math = (
        r'(?:number=|if-zero|next-power-of-2|each-integer|\\?1\\+|'
        r'fp-special\\?|imaginary-part|unless-zero|float>bits|number\\?|'
        r'fp-infinity\\?|bignum\\?|fp-snan\\?|denominator|fp-bitwise=|\\*|'
        r'\\+|power-of-2\\?|-|u>=|/|>=|bitand|log2-expects-positive|<|'
        r'log2|>|integer\\?|number|bits>double|2/|zero\\?|(find-integer)|'
        r'bits>float|float\\?|shift|ratio\\?|even\\?|ratio|fp-sign|bitnot|'
        r'>fixnum|complex\\?|/i|/f|byte-array>bignum|when-zero|sgn|>bignum|'
        r'next-float|u<|u>|mod|recip|rational|find-last-integer|>float|'
        r'(all-integers\\?)|2^|times|integer|fixnum\\?|neg|fixnum|sq|'
        r'bignum|(each-integer)|bit\\?|fp-qnan\\?|find-integer|complex|'
        r'<fp-nan>|real|double>bits|bitor|rem|fp-nan-payload|all-integers\\?|'
        r'real-part|log2-expects-positive\\?|prev-float|align|unordered\\?|'
        r'float|fp-nan\\?|abs|bitxor|u<=|odd\\?|<=|/mod|rational\\?|>integer|'
        r'real\\?|numerator)\s'
        )

    builtin_sequences = (
        r'(?:member-eq\\?|append|assert-sequence=|find-last-from|trim-head-slice|'
        r'clone-like|3sequence|assert-sequence\\?|map-as|last-index-from|'
        r'reversed|index-from|cut\\*|pad-tail|remove-eq!|concat-as|'
        r'but-last|snip|trim-tail|nths|nth|2selector|sequence|slice\\?|'
        r'<slice>|partition|remove-nth|tail-slice|empty\\?|tail\\*|'
        r'if-empty|find-from|virtual-sequence\\?|member\\?|set-length|'
        r'drop-prefix|unclip|unclip-last-slice|iota|map-sum|'
        r'bounds-error\\?|sequence-hashcode-step|selector-for|'
        r'accumulate-as|map|start|midpoint@|\\(accumulate\\)|rest-slice|'
        r'prepend|fourth|sift|accumulate!|new-sequence|follow|map!|'
        r'like|first4|1sequence|reverse|slice|unless-empty|padding|'
        r'virtual@|repetition\\?|set-last|index|4sequence|max-length|'
        r'set-second|immutable-sequence|first2|first3|replicate-as|'
        r'reduce-index|unclip-slice|supremum|suffix!|insert-nth|'
        r'trim-tail-slice|tail|3append|short|count|suffix|concat|'
        r'flip|filter|sum|immutable\\?|reverse!|2sequence|map-integers|'
        r'delete-all|start\\*|indices|snip-slice|check-slice|sequence\\?|'
        r'head|map-find|filter!|append-as|reduce|sequence=|halves|'
        r'collapse-slice|interleave|2map|filter-as|binary-reduce|'
        r'slice-error\\?|product|bounds-check\\?|bounds-check|harvest|'
        r'immutable|virtual-exemplar|find|produce|remove|pad-head|last|'
        r'replicate|set-fourth|remove-eq|shorten|reversed\\?|'
        r'map-find-last|3map-as|2unclip-slice|shorter\\?|3map|find-last|'
        r'head-slice|pop\\*|2map-as|tail-slice\\*|but-last-slice|'
        r'2map-reduce|iota\\?|collector-for|accumulate|each|selector|'
        r'append!|new-resizable|cut-slice|each-index|head-slice\\*|'
        r'2reverse-each|sequence-hashcode|pop|set-nth|\\?nth|'
        r'<flat-slice>|second|join|when-empty|collector|'
        r'immutable-sequence\\?|<reversed>|all\\?|3append-as|'
        r'virtual-sequence|subseq\\?|remove-nth!|push-either|new-like|'
        r'length|last-index|push-if|2all\\?|lengthen|assert-sequence|'
        r'copy|map-reduce|move|third|first|3each|tail\\?|set-first|'
        r'prefix|bounds-error|any\\?|<repetition>|trim-slice|exchange|'
        r'surround|2reduce|cut|change-nth|min-length|set-third|produce-as|'
        r'push-all|head\\?|delete-slice|rest|sum-lengths|2each|head\\*|'
        r'infimum|remove!|glue|slice-error|subseq|trim|replace-slice|'
        r'push|repetition|map-index|trim-head|unclip-last|mismatch)\s'
        )

    builtin_namespaces = (
        r'(?:global|\\+@|change|set-namestack|change-global|init-namespaces|'
        r'on|off|set-global|namespace|set|with-scope|bind|with-variable|'
        r'inc|dec|counter|initialize|namestack|get|get-global|make-assoc)\s'
        )

    builtin_arrays = (
        r'(?:<array>|2array|3array|pair|>array|1array|4array|pair\\?|'
        r'array|resize-array|array\\?)\s'
        )

    builtin_io = (
        r'(?:\\+character\\+|bad-seek-type\\?|readln|each-morsel|stream-seek|'
        r'read|print|with-output-stream|contents|write1|stream-write1|'
        r'stream-copy|stream-element-type|with-input-stream|'
        r'stream-print|stream-read|stream-contents|stream-tell|'
        r'tell-output|bl|seek-output|bad-seek-type|nl|stream-nl|write|'
        r'flush|stream-lines|\\+byte\\+|stream-flush|read1|'
        r'seek-absolute\\?|stream-read1|lines|stream-readln|'
        r'stream-read-until|each-line|seek-end|with-output-stream\\*|'
        r'seek-absolute|with-streams|seek-input|seek-relative\\?|'
        r'input-stream|stream-write|read-partial|seek-end\\?|'
        r'seek-relative|error-stream|read-until|with-input-stream\\*|'
        r'with-streams\\*|tell-input|each-block|output-stream|'
        r'stream-read-partial|each-stream-block|each-stream-line)\s'
        )

    builtin_strings = (
        r'(?:resize-string|>string|<string>|1string|string|string\\?)\s'
        )

    builtin_vectors = (
        r'(?:vector\\?|<vector>|\\?push|vector|>vector|1vector)\s'
        )

    builtin_continuations = (
        r'(?:with-return|restarts|return-continuation|with-datastack|'
        r'recover|rethrow-restarts|<restart>|ifcc|set-catchstack|'
        r'>continuation<|cleanup|ignore-errors|restart\\?|'
        r'compute-restarts|attempt-all-error|error-thread|continue|'
        r'<continuation>|attempt-all-error\\?|condition\\?|'
        r'<condition>|throw-restarts|error|catchstack|continue-with|'
        r'thread-error-hook|continuation|rethrow|callcc1|'
        r'error-continuation|callcc0|attempt-all|condition|'
        r'continuation\\?|restart|return)\s'
        )

    tokens = {
        'root': [
            # TODO: (( inputs -- outputs ))
            # TODO: << ... >>

            # defining words
            (r'(\s*)(:|::|MACRO:|MEMO:)(\s+)(\S+)',
             bygroups(Text, Keyword, Text, Name.Function)),
            (r'(\s*)(M:)(\s+)(\S+)(\s+)(\S+)',
             bygroups(Text, Keyword, Text, Name.Class, Text, Name.Function)),
            (r'(\s*)(GENERIC:)(\s+)(\S+)',
             bygroups(Text, Keyword, Text, Name.Function)),
            (r'(\s*)(HOOK:|GENERIC#)(\s+)(\S+)(\s+)(\S+)',
             bygroups(Text, Keyword, Text, Name.Function, Text, Name.Function)),
            (r'(\()(\s+)', bygroups(Name.Function, Text), 'stackeffect'),
            (r'\;\s', Keyword),

            # imports and namespaces
            (r'(USING:)((?:\s|\\\s)+)',
             bygroups(Keyword.Namespace, Text), 'import'),
            (r'(USE:)(\s+)(\S+)',
             bygroups(Keyword.Namespace, Text, Name.Namespace)),
            (r'(UNUSE:)(\s+)(\S+)',
             bygroups(Keyword.Namespace, Text, Name.Namespace)),
            (r'(QUALIFIED:)(\s+)(\S+)',
             bygroups(Keyword.Namespace, Text, Name.Namespace)),
            (r'(QUALIFIED-WITH:)(\s+)(\S+)',
             bygroups(Keyword.Namespace, Text, Name.Namespace)),
            (r'(FROM:|EXCLUDE:)(\s+)(\S+)(\s+)(=>)',
             bygroups(Keyword.Namespace, Text, Name.Namespace, Text, Text)),
            (r'(IN:)(\s+)(\S+)',
             bygroups(Keyword.Namespace, Text, Name.Namespace)),
            (r'(?:ALIAS|DEFER|FORGET|POSTPONE):', Keyword.Namespace),

            # tuples and classes
            (r'(TUPLE:)(\s+)(\S+)(\s+<\s+)(\S+)',
             bygroups(Keyword, Text, Name.Class, Text, Name.Class), 'slots'),
            (r'(TUPLE:)(\s+)(\S+)',
             bygroups(Keyword, Text, Name.Class), 'slots'),
            (r'(UNION:)(\s+)(\S+)', bygroups(Keyword, Text, Name.Class)),
            (r'(INTERSECTION:)(\s+)(\S+)', bygroups(Keyword, Text, Name.Class)),
            (r'(PREDICATE:)(\s+)(\S+)(\s+<\s+)(\S+)',
                bygroups(Keyword, Text, Name.Class, Text, Name.Class)),
            (r'(C:)(\s+)(\S+)(\s+)(\S+)',
                bygroups(Keyword, Text, Name.Function, Text, Name.Class)),
            (r'INSTANCE:', Keyword),
            (r'SLOT:', Keyword),
            (r'MIXIN:', Keyword),
            (r'(?:SINGLETON|SINGLETONS):', Keyword),

            # other syntax
            (r'CONSTANT:', Keyword),
            (r'(?:SYMBOL|SYMBOLS):', Keyword),
            (r'ERROR:', Keyword),
            (r'SYNTAX:', Keyword),
            (r'(HELP:)(\s+)(\S+)', bygroups(Keyword, Text, Name.Function)),
            (r'(MAIN:)(\s+)(\S+)',
             bygroups(Keyword.Namespace, Text, Name.Function)),
            (r'(?:ALIEN|TYPEDEF|FUNCTION|STRUCT):', Keyword),

            # vocab.private
            # TODO: words inside vocab.private should have red names?
            (r'(?:<PRIVATE|PRIVATE>)', Keyword.Namespace),

            # strings
            (r'"""\s+(?:.|\n)*?\s+"""', String),
            (r'"(?:\\\\|\\"|[^"])*"', String),
            (r'CHAR:\s+(\\[\\abfnrstv]*|\S)\s', String.Char),

            # comments
            (r'\!\s+.*$', Comment),
            (r'#\!\s+.*$', Comment),

            # boolean constants
            (r'(t|f)\s', Name.Constant),

            # numbers
            (r'-?\d+\.\d+\s', Number.Float),
            (r'-?\d+\s', Number.Integer),
            (r'HEX:\s+[a-fA-F\d]+\s', Number.Hex),
            (r'BIN:\s+[01]+\s', Number.Integer),
            (r'OCT:\s+[0-7]+\s', Number.Oct),

            # operators
            (r'[-+/*=<>^]\s', Operator),

            # keywords
            (r'(?:deprecated|final|foldable|flushable|inline|recursive)\s',
             Keyword),

            # builtins
            (builtin_kernel, Name.Builtin),
            (builtin_assocs, Name.Builtin),
            (builtin_combinators, Name.Builtin),
            (builtin_math, Name.Builtin),
            (builtin_sequences, Name.Builtin),
            (builtin_namespaces, Name.Builtin),
            (builtin_arrays, Name.Builtin),
            (builtin_io, Name.Builtin),
            (builtin_strings, Name.Builtin),
            (builtin_vectors, Name.Builtin),
            (builtin_continuations, Name.Builtin),

            # whitespaces - usually not relevant
            (r'\s+', Text),

            # everything else is text
            (r'\S+', Text),
        ],

        'stackeffect': [
            (r'\s*\(', Name.Function, 'stackeffect'),
            (r'\)', Name.Function, '#pop'),
            (r'\-\-', Name.Function),
            (r'\s+', Text),
            (r'\S+', Name.Variable),
        ],

        'slots': [
            (r'\s+', Text),
            (r';\s', Keyword, '#pop'),
            (r'\S+', Name.Variable),
        ],

        'import': [
            (r';', Keyword, '#pop'),
            (r'\S+', Name.Namespace),
            (r'\s+', Text),
        ],
    }


class FancyLexer(RegexLexer):
    """
    Pygments Lexer For `Fancy <http://www.fancy-lang.org/>`_.

    Fancy is a self-hosted, pure object-oriented, dynamic,
    class-based, concurrent general-purpose programming language
    running on Rubinius, the Ruby VM.

    *New in Pygments 1.5.*
    """
    name = 'Fancy'
    filenames = ['*.fy', '*.fancypack']
    aliases = ['fancy', 'fy']
    mimetypes = ['text/x-fancysrc']

    tokens = {
        # copied from PerlLexer:
        'balanced-regex': [
            (r'/(\\\\|\\/|[^/])*/[egimosx]*', String.Regex, '#pop'),
            (r'!(\\\\|\\!|[^!])*![egimosx]*', String.Regex, '#pop'),
            (r'\\(\\\\|[^\\])*\\[egimosx]*', String.Regex, '#pop'),
            (r'{(\\\\|\\}|[^}])*}[egimosx]*', String.Regex, '#pop'),
            (r'<(\\\\|\\>|[^>])*>[egimosx]*', String.Regex, '#pop'),
            (r'\[(\\\\|\\\]|[^\]])*\][egimosx]*', String.Regex, '#pop'),
            (r'\((\\\\|\\\)|[^\)])*\)[egimosx]*', String.Regex, '#pop'),
            (r'@(\\\\|\\\@|[^\@])*@[egimosx]*', String.Regex, '#pop'),
            (r'%(\\\\|\\\%|[^\%])*%[egimosx]*', String.Regex, '#pop'),
            (r'\$(\\\\|\\\$|[^\$])*\$[egimosx]*', String.Regex, '#pop'),
        ],
        'root': [
            (r'\s+', Text),

            # balanced delimiters (copied from PerlLexer):
            (r's{(\\\\|\\}|[^}])*}\s*', String.Regex, 'balanced-regex'),
            (r's<(\\\\|\\>|[^>])*>\s*', String.Regex, 'balanced-regex'),
            (r's\[(\\\\|\\\]|[^\]])*\]\s*', String.Regex, 'balanced-regex'),
            (r's\((\\\\|\\\)|[^\)])*\)\s*', String.Regex, 'balanced-regex'),
            (r'm?/(\\\\|\\/|[^/\n])*/[gcimosx]*', String.Regex),
            (r'm(?=[/!\\{<\[\(@%\$])', String.Regex, 'balanced-regex'),

            # Comments
            (r'#(.*?)\n', Comment.Single),
            # Symbols
            (r'\'([^\'\s\[\]\(\)\{\}]+|\[\])', String.Symbol),
            # Multi-line DoubleQuotedString
            (r'"""(\\\\|\\"|[^"])*"""', String),
            # DoubleQuotedString
            (r'"(\\\\|\\"|[^"])*"', String),
            # keywords
            (r'(def|class|try|catch|finally|retry|return|return_local|match|'
             r'case|->|=>)\b', Keyword),
            # constants
            (r'(self|super|nil|false|true)\b', Name.Constant),
            (r'[(){};,/?\|:\\]', Punctuation),
            # names
            (r'(Object|Array|Hash|Directory|File|Class|String|Number|'
             r'Enumerable|FancyEnumerable|Block|TrueClass|NilClass|'
             r'FalseClass|Tuple|Symbol|Stack|Set|FancySpec|Method|Package|'
             r'Range)\b', Name.Builtin),
            # functions
            (r'[a-zA-Z]([a-zA-Z0-9_]|[-+?!=*/^><%])*:', Name.Function),
            # operators, must be below functions
            (r'[-+*/~,<>=&!?%^\[\]\.$]+', Operator),
            ('[A-Z][a-zA-Z0-9_]*', Name.Constant),
            ('@[a-zA-Z_][a-zA-Z0-9_]*', Name.Variable.Instance),
            ('@@[a-zA-Z_][a-zA-Z0-9_]*', Name.Variable.Class),
            ('@@?', Operator),
            ('[a-zA-Z_][a-zA-Z0-9_]*', Name),
            # numbers - / checks are necessary to avoid mismarking regexes,
            # see comment in RubyLexer
            (r'(0[oO]?[0-7]+(?:_[0-7]+)*)(\s*)([/?])?',
             bygroups(Number.Oct, Text, Operator)),
            (r'(0[xX][0-9A-Fa-f]+(?:_[0-9A-Fa-f]+)*)(\s*)([/?])?',
             bygroups(Number.Hex, Text, Operator)),
            (r'(0[bB][01]+(?:_[01]+)*)(\s*)([/?])?',
             bygroups(Number.Bin, Text, Operator)),
            (r'([\d]+(?:_\d+)*)(\s*)([/?])?',
             bygroups(Number.Integer, Text, Operator)),
            (r'\d+([eE][+-]?[0-9]+)|\d+\.\d+([eE][+-]?[0-9]+)?', Number.Float),
            (r'\d+', Number.Integer)
        ]
    }


class DgLexer(RegexLexer):
    """
    Lexer for `dg <http://pyos.github.com/dg>`_,
    a functional and object-oriented programming language
    running on the CPython 3 VM.

    *New in Pygments 1.6.*
    """
    name = 'dg'
    aliases = ['dg']
    filenames = ['*.dg']
    mimetypes = ['text/x-dg']

    tokens = {
        'root': [
            # Whitespace:
            (r'\s+', Text),
            (r'#.*?$', Comment.Single),
            # Lexemes:
            #  Numbers
            (r'0[bB][01]+', Number.Bin),
            (r'0[oO][0-7]+', Number.Oct),
            (r'0[xX][\da-fA-F]+', Number.Hex),
            (r'[+-]?\d+\.\d+([eE][+-]?\d+)?[jJ]?', Number.Float),
            (r'[+-]?\d+[eE][+-]?\d+[jJ]?', Number.Float),
            (r'[+-]?\d+[jJ]?', Number.Integer),
            #  Character/String Literals
            (r"[br]*'''", String, combined('stringescape', 'tsqs', 'string')),
            (r'[br]*"""', String, combined('stringescape', 'tdqs', 'string')),
            (r"[br]*'", String, combined('stringescape', 'sqs', 'string')),
            (r'[br]*"', String, combined('stringescape', 'dqs', 'string')),
            #  Operators
            (r"`\w+'*`", Operator), # Infix links
            #   Reserved infix links
            (r'\b(or|and|if|else|where|is|in)\b', Operator.Word),
            (r'[!$%&*+\-./:<-@\\^|~;,]+', Operator),
            #  Identifiers
            #   Python 3 types
            (r"(?<!\.)(bool|bytearray|bytes|classmethod|complex|dict'?|"
             r"float|frozenset|int|list'?|memoryview|object|property|range|"
             r"set'?|slice|staticmethod|str|super|tuple'?|type)"
             r"(?!['\w])", Name.Builtin),
            #   Python 3 builtins + some more
            (r'(?<!\.)(__import__|abs|all|any|bin|bind|chr|cmp|compile|complex|'
             r'delattr|dir|divmod|drop|dropwhile|enumerate|eval|filter|flip|'
             r'foldl1?|format|fst|getattr|globals|hasattr|hash|head|hex|id|'
             r'init|input|isinstance|issubclass|iter|iterate|last|len|locals|'
             r'map|max|min|next|oct|open|ord|pow|print|repr|reversed|round|'
             r'setattr|scanl1?|snd|sorted|sum|tail|take|takewhile|vars|zip)'
             r"(?!['\w])", Name.Builtin),
            (r"(?<!\.)(self|Ellipsis|NotImplemented|None|True|False)(?!['\w])",
             Name.Builtin.Pseudo),
            (r"(?<!\.)[A-Z]\w*(Error|Exception|Warning)'*(?!['\w])",
             Name.Exception),
            (r"(?<!\.)(KeyboardInterrupt|SystemExit|StopIteration|"
             r"GeneratorExit)(?!['\w])", Name.Exception),
            #   Compiler-defined identifiers
            (r"(?<![\.\w])(import|inherit|for|while|switch|not|raise|unsafe|"
             r"yield|with)(?!['\w])", Keyword.Reserved),
            #   Other links
            (r"[A-Z_']+\b", Name),
            (r"[A-Z][\w']*\b", Keyword.Type),
            (r"\w+'*", Name),
            #  Blocks
            (r'[()]', Punctuation),
        ],
        'stringescape': [
            (r'\\([\\abfnrtv"\']|\n|N{.*?}|u[a-fA-F0-9]{4}|'
             r'U[a-fA-F0-9]{8}|x[a-fA-F0-9]{2}|[0-7]{1,3})', String.Escape)
        ],
        'string': [
            (r'%(\([a-zA-Z0-9_]+\))?[-#0 +]*([0-9]+|[*])?(\.([0-9]+|[*]))?'
             '[hlL]?[diouxXeEfFgGcrs%]', String.Interpol),
            (r'[^\\\'"%\n]+', String),
            # quotes, percents and backslashes must be parsed one at a time
            (r'[\'"\\]', String),
            # unhandled string formatting sign
            (r'%', String),
            (r'\n', String)
        ],
        'dqs': [
            (r'"', String, '#pop')
        ],
        'sqs': [
            (r"'", String, '#pop')
        ],
        'tdqs': [
            (r'"""', String, '#pop')
        ],
        'tsqs': [
            (r"'''", String, '#pop')
        ],
    }

class Perl6Lexer(ExtendedRegexLexer):
    """
    For `Perl 6 <http://www.perl6.org>`_ source code.

    *New in Pygments 1.7.*
    """

    name      = 'Perl6'
    aliases   = ['perl6', 'pl6']
    filenames = ['*.pl', '*.pm', '*.nqp', '*.p6', '*.6pl', '*.p6l', '*.pl6',
                 '*.6pm', '*.p6m', '*.pm6']
    mimetypes = ['text/x-perl6', 'application/x-perl6']
    flags     = re.MULTILINE | re.DOTALL | re.UNICODE

    PERL6_IDENTIFIER_RANGE = "['a-zA-Z0-9_:-]"

    PERL6_KEYWORDS = (
        'BEGIN', 'CATCH', 'CHECK', 'CONTROL', 'END', 'ENTER', 'FIRST', 'INIT',
        'KEEP', 'LAST', 'LEAVE', 'NEXT', 'POST', 'PRE', 'START', 'TEMP',
        'UNDO', 'as', 'assoc', 'async', 'augment', 'binary', 'break', 'but',
        'cached', 'category', 'class', 'constant', 'contend', 'continue',
        'copy', 'deep', 'default', 'defequiv', 'defer', 'die', 'do', 'else',
        'elsif', 'enum', 'equiv', 'exit', 'export', 'fail', 'fatal', 'for',
        'gather', 'given', 'goto', 'grammar', 'handles', 'has', 'if', 'inline',
        'irs', 'is', 'last', 'leave', 'let', 'lift', 'loop', 'looser', 'macro',
        'make', 'maybe', 'method', 'module', 'multi', 'my', 'next', 'of',
        'ofs', 'only', 'oo', 'ors', 'our', 'package', 'parsed', 'prec',
        'proto', 'readonly', 'redo', 'ref', 'regex', 'reparsed', 'repeat',
        'require', 'required', 'return', 'returns', 'role', 'rule', 'rw',
        'self', 'slang', 'state', 'sub', 'submethod', 'subset', 'supersede',
        'take', 'temp', 'tighter', 'token', 'trusts', 'try', 'unary',
        'unless', 'until', 'use', 'warn', 'when', 'where', 'while', 'will',
    )

    PERL6_BUILTINS = (
        'ACCEPTS', 'HOW', 'REJECTS', 'VAR', 'WHAT', 'WHENCE', 'WHERE', 'WHICH',
        'WHO', 'abs', 'acos', 'acosec', 'acosech', 'acosh', 'acotan', 'acotanh',
        'all', 'any', 'approx', 'arity', 'asec', 'asech', 'asin', 'asinh'
        'assuming', 'atan', 'atan2', 'atanh', 'attr', 'bless', 'body', 'by'
        'bytes', 'caller', 'callsame', 'callwith', 'can', 'capitalize', 'cat',
        'ceiling', 'chars', 'chmod', 'chomp', 'chop', 'chr', 'chroot',
        'circumfix', 'cis', 'classify', 'clone', 'close', 'cmp_ok', 'codes',
        'comb', 'connect', 'contains', 'context', 'cos', 'cosec', 'cosech',
        'cosh', 'cotan', 'cotanh', 'count', 'defined', 'delete', 'diag',
        'dies_ok', 'does', 'e', 'each', 'eager', 'elems', 'end', 'eof', 'eval',
        'eval_dies_ok', 'eval_elsewhere', 'eval_lives_ok', 'evalfile', 'exists',
        'exp', 'first', 'flip', 'floor', 'flunk', 'flush', 'fmt', 'force_todo',
        'fork', 'from', 'getc', 'gethost', 'getlogin', 'getpeername', 'getpw',
        'gmtime', 'graphs', 'grep', 'hints', 'hyper', 'im', 'index', 'infix',
        'invert', 'is_approx', 'is_deeply', 'isa', 'isa_ok', 'isnt', 'iterator',
        'join', 'key', 'keys', 'kill', 'kv', 'lastcall', 'lazy', 'lc', 'lcfirst',
        'like', 'lines', 'link', 'lives_ok', 'localtime', 'log', 'log10', 'map',
        'max', 'min', 'minmax', 'name', 'new', 'nextsame', 'nextwith', 'nfc',
        'nfd', 'nfkc', 'nfkd', 'nok_error', 'nonce', 'none', 'normalize', 'not',
        'nothing', 'ok', 'once', 'one', 'open', 'opendir', 'operator', 'ord',
        'p5chomp', 'p5chop', 'pack', 'pair', 'pairs', 'pass', 'perl', 'pi',
        'pick', 'plan', 'plan_ok', 'polar', 'pop', 'pos', 'postcircumfix',
        'postfix', 'pred', 'prefix', 'print', 'printf', 'push', 'quasi',
        'quotemeta', 'rand', 're', 'read', 'readdir', 'readline', 'reduce',
        'reverse', 'rewind', 'rewinddir', 'rindex', 'roots', 'round',
        'roundrobin', 'run', 'runinstead', 'sameaccent', 'samecase', 'say',
        'sec', 'sech', 'sech', 'seek', 'shape', 'shift', 'sign', 'signature',
        'sin', 'sinh', 'skip', 'skip_rest', 'sleep', 'slurp', 'sort', 'splice',
        'split', 'sprintf', 'sqrt', 'srand', 'strand', 'subst', 'substr', 'succ',
        'sum', 'symlink', 'tan', 'tanh', 'throws_ok', 'time', 'times', 'to',
        'todo', 'trim', 'trim_end', 'trim_start', 'true', 'truncate', 'uc',
        'ucfirst', 'undef', 'undefine', 'uniq', 'unlike', 'unlink', 'unpack',
        'unpolar', 'unshift', 'unwrap', 'use_ok', 'value', 'values', 'vec',
        'version_lt', 'void', 'wait', 'want', 'wrap', 'write', 'zip',
    )

    PERL6_BUILTIN_CLASSES = (
        'Abstraction', 'Any', 'AnyChar', 'Array', 'Associative', 'Bag', 'Bit',
        'Blob', 'Block', 'Bool', 'Buf', 'Byte', 'Callable', 'Capture', 'Char', 'Class',
        'Code', 'Codepoint', 'Comparator', 'Complex', 'Decreasing', 'Exception',
        'Failure', 'False', 'Grammar', 'Grapheme', 'Hash', 'IO', 'Increasing',
        'Int', 'Junction', 'KeyBag', 'KeyExtractor', 'KeyHash', 'KeySet',
        'KitchenSink', 'List', 'Macro', 'Mapping', 'Match', 'Matcher', 'Method',
        'Module', 'Num', 'Object', 'Ordered', 'Ordering', 'OrderingPair',
        'Package', 'Pair', 'Positional', 'Proxy', 'Range', 'Rat', 'Regex',
        'Role', 'Routine', 'Scalar', 'Seq', 'Set', 'Signature', 'Str', 'StrLen',
        'StrPos', 'Sub', 'Submethod', 'True', 'UInt', 'Undef', 'Version', 'Void',
        'Whatever', 'bit', 'bool', 'buf', 'buf1', 'buf16', 'buf2', 'buf32',
        'buf4', 'buf64', 'buf8', 'complex', 'int', 'int1', 'int16', 'int2',
        'int32', 'int4', 'int64', 'int8', 'num', 'rat', 'rat1', 'rat16', 'rat2',
        'rat32', 'rat4', 'rat64', 'rat8', 'uint', 'uint1', 'uint16', 'uint2',
        'uint32', 'uint4', 'uint64', 'uint8', 'utf16', 'utf32', 'utf8',
    )

    PERL6_OPERATORS = (
        'X', 'Z', 'after', 'also', 'and', 'andthen', 'before', 'cmp', 'div',
        'eq', 'eqv', 'extra', 'ff', 'fff', 'ge', 'gt', 'le', 'leg', 'lt', 'm',
        'mm', 'mod', 'ne', 'or', 'orelse', 'rx', 's', 'tr', 'x', 'xor', 'xx',
        '++', '--', '**', '!', '+', '-', '~', '?', '|', '||', '+^', '~^', '?^',
        '^', '*', '/', '%', '%%', '+&', '+<', '+>', '~&', '~<', '~>', '?&',
        'gcd', 'lcm', '+', '-', '+|', '+^', '~|', '~^', '?|', '?^',
        '~', '&', '^', 'but', 'does', '<=>', '..', '..^', '^..', '^..^',
        '!=', '==', '<', '<=', '>', '>=', '~~', '===', '!eqv',
        '&&', '||', '^^', '//', 'min', 'max', '??', '!!', 'ff', 'fff', 'so',
        'not', '<==', '==>', '<<==', '==>>',
    )

    # Perl 6 has a *lot* of possible bracketing characters
    # this list was lifted from STD.pm6 (https://github.com/perl6/std)
    PERL6_BRACKETS = {
        '\u0028' : '\u0029', '\u003c' : '\u003e', '\u005b' : '\u005d', '\u007b' : '\u007d',
        '\u00ab' : '\u00bb', '\u0f3a' : '\u0f3b', '\u0f3c' : '\u0f3d', '\u169b' : '\u169c',
        '\u2018' : '\u2019', '\u201a' : '\u2019', '\u201b' : '\u2019', '\u201c' : '\u201d',
        '\u201e' : '\u201d', '\u201f' : '\u201d', '\u2039' : '\u203a', '\u2045' : '\u2046',
        '\u207d' : '\u207e', '\u208d' : '\u208e', '\u2208' : '\u220b', '\u2209' : '\u220c',
        '\u220a' : '\u220d', '\u2215' : '\u29f5', '\u223c' : '\u223d', '\u2243' : '\u22cd',
        '\u2252' : '\u2253', '\u2254' : '\u2255', '\u2264' : '\u2265', '\u2266' : '\u2267',
        '\u2268' : '\u2269', '\u226a' : '\u226b', '\u226e' : '\u226f', '\u2270' : '\u2271',
        '\u2272' : '\u2273', '\u2274' : '\u2275', '\u2276' : '\u2277', '\u2278' : '\u2279',
        '\u227a' : '\u227b', '\u227c' : '\u227d', '\u227e' : '\u227f', '\u2280' : '\u2281',
        '\u2282' : '\u2283', '\u2284' : '\u2285', '\u2286' : '\u2287', '\u2288' : '\u2289',
        '\u228a' : '\u228b', '\u228f' : '\u2290', '\u2291' : '\u2292', '\u2298' : '\u29b8',
        '\u22a2' : '\u22a3', '\u22a6' : '\u2ade', '\u22a8' : '\u2ae4', '\u22a9' : '\u2ae3',
        '\u22ab' : '\u2ae5', '\u22b0' : '\u22b1', '\u22b2' : '\u22b3', '\u22b4' : '\u22b5',
        '\u22b6' : '\u22b7', '\u22c9' : '\u22ca', '\u22cb' : '\u22cc', '\u22d0' : '\u22d1',
        '\u22d6' : '\u22d7', '\u22d8' : '\u22d9', '\u22da' : '\u22db', '\u22dc' : '\u22dd',
        '\u22de' : '\u22df', '\u22e0' : '\u22e1', '\u22e2' : '\u22e3', '\u22e4' : '\u22e5',
        '\u22e6' : '\u22e7', '\u22e8' : '\u22e9', '\u22ea' : '\u22eb', '\u22ec' : '\u22ed',
        '\u22f0' : '\u22f1', '\u22f2' : '\u22fa', '\u22f3' : '\u22fb', '\u22f4' : '\u22fc',
        '\u22f6' : '\u22fd', '\u22f7' : '\u22fe', '\u2308' : '\u2309', '\u230a' : '\u230b',
        '\u2329' : '\u232a', '\u23b4' : '\u23b5', '\u2768' : '\u2769', '\u276a' : '\u276b',
        '\u276c' : '\u276d', '\u276e' : '\u276f', '\u2770' : '\u2771', '\u2772' : '\u2773',
        '\u2774' : '\u2775', '\u27c3' : '\u27c4', '\u27c5' : '\u27c6', '\u27d5' : '\u27d6',
        '\u27dd' : '\u27de', '\u27e2' : '\u27e3', '\u27e4' : '\u27e5', '\u27e6' : '\u27e7',
        '\u27e8' : '\u27e9', '\u27ea' : '\u27eb', '\u2983' : '\u2984', '\u2985' : '\u2986',
        '\u2987' : '\u2988', '\u2989' : '\u298a', '\u298b' : '\u298c', '\u298d' : '\u298e',
        '\u298f' : '\u2990', '\u2991' : '\u2992', '\u2993' : '\u2994', '\u2995' : '\u2996',
        '\u2997' : '\u2998', '\u29c0' : '\u29c1', '\u29c4' : '\u29c5', '\u29cf' : '\u29d0',
        '\u29d1' : '\u29d2', '\u29d4' : '\u29d5', '\u29d8' : '\u29d9', '\u29da' : '\u29db',
        '\u29f8' : '\u29f9', '\u29fc' : '\u29fd', '\u2a2b' : '\u2a2c', '\u2a2d' : '\u2a2e',
        '\u2a34' : '\u2a35', '\u2a3c' : '\u2a3d', '\u2a64' : '\u2a65', '\u2a79' : '\u2a7a',
        '\u2a7d' : '\u2a7e', '\u2a7f' : '\u2a80', '\u2a81' : '\u2a82', '\u2a83' : '\u2a84',
        '\u2a8b' : '\u2a8c', '\u2a91' : '\u2a92', '\u2a93' : '\u2a94', '\u2a95' : '\u2a96',
        '\u2a97' : '\u2a98', '\u2a99' : '\u2a9a', '\u2a9b' : '\u2a9c', '\u2aa1' : '\u2aa2',
        '\u2aa6' : '\u2aa7', '\u2aa8' : '\u2aa9', '\u2aaa' : '\u2aab', '\u2aac' : '\u2aad',
        '\u2aaf' : '\u2ab0', '\u2ab3' : '\u2ab4', '\u2abb' : '\u2abc', '\u2abd' : '\u2abe',
        '\u2abf' : '\u2ac0', '\u2ac1' : '\u2ac2', '\u2ac3' : '\u2ac4', '\u2ac5' : '\u2ac6',
        '\u2acd' : '\u2ace', '\u2acf' : '\u2ad0', '\u2ad1' : '\u2ad2', '\u2ad3' : '\u2ad4',
        '\u2ad5' : '\u2ad6', '\u2aec' : '\u2aed', '\u2af7' : '\u2af8', '\u2af9' : '\u2afa',
        '\u2e02' : '\u2e03', '\u2e04' : '\u2e05', '\u2e09' : '\u2e0a', '\u2e0c' : '\u2e0d',
        '\u2e1c' : '\u2e1d', '\u2e20' : '\u2e21', '\u3008' : '\u3009', '\u300a' : '\u300b',
        '\u300c' : '\u300d', '\u300e' : '\u300f', '\u3010' : '\u3011', '\u3014' : '\u3015',
        '\u3016' : '\u3017', '\u3018' : '\u3019', '\u301a' : '\u301b', '\u301d' : '\u301e',
        '\ufd3e' : '\ufd3f', '\ufe17' : '\ufe18', '\ufe35' : '\ufe36', '\ufe37' : '\ufe38',
        '\ufe39' : '\ufe3a', '\ufe3b' : '\ufe3c', '\ufe3d' : '\ufe3e', '\ufe3f' : '\ufe40',
        '\ufe41' : '\ufe42', '\ufe43' : '\ufe44', '\ufe47' : '\ufe48', '\ufe59' : '\ufe5a',
        '\ufe5b' : '\ufe5c', '\ufe5d' : '\ufe5e', '\uff08' : '\uff09', '\uff1c' : '\uff1e',
        '\uff3b' : '\uff3d', '\uff5b' : '\uff5d', '\uff5f' : '\uff60', '\uff62' : '\uff63',
    }

    def _build_word_match(words, boundary_regex_fragment = None, prefix = '', suffix = ''):
        if boundary_regex_fragment is None:
            return r'\b(' + prefix + r'|'.join([ re.escape(x) for x in words]) + suffix + r')\b'
        else:
            return r'(?<!' + boundary_regex_fragment + ')' + prefix + '(' + \
                r'|'.join([ re.escape(x) for x in words]) + r')' + suffix + '(?!' + boundary_regex_fragment + ')'

    def brackets_callback(token_class):
        def callback(lexer, match, context):
            groups        = match.groupdict()
            opening_chars = groups['delimiter']
            n_chars       = len(opening_chars)
            adverbs       = groups.get('adverbs')

            closer = Perl6Lexer.PERL6_BRACKETS.get(opening_chars[0])
            text   = context.text

            if closer is None: # it's not a mirrored character, which means we
                               # just need to look for the next occurrence

                end_pos = text.find(opening_chars, match.start('delimiter') + n_chars)
            else: # we need to look for the corresponding closing character,
                  # keep nesting in mind
                closing_chars = closer * n_chars
                nesting_level = 1

                search_pos = match.start('delimiter')

                while nesting_level > 0:
                    next_open_pos  = text.find(opening_chars, search_pos + n_chars)
                    next_close_pos = text.find(closing_chars, search_pos + n_chars)

                    if next_close_pos == -1:
                        next_close_pos = len(text)
                        nesting_level  = 0
                    elif next_open_pos != -1 and next_open_pos < next_close_pos:
                        nesting_level += 1
                        search_pos = next_open_pos
                    else: # next_close_pos < next_open_pos
                        nesting_level -= 1
                        search_pos = next_close_pos

                end_pos = next_close_pos

            if adverbs is not None and re.search(r':to\b', adverbs):
                heredoc_terminator = text[match.start('delimiter') + n_chars : end_pos]
                end_heredoc = re.search(r'^\s*' + re.escape(heredoc_terminator) + r'\s*$', text[ match.end('delimiter') : ], re.MULTILINE)

                if end_heredoc:
                    end_pos = match.end('delimiter') + end_heredoc.end()
                else:
                    end_pos = len(text)

            yield match.start(), token_class, text[match.start() : end_pos + n_chars]
            context.pos = end_pos + n_chars

        return callback

    def opening_brace_callback(lexer, match, context):
        stack = context.stack

        yield match.start(), Text, context.text[match.start() : match.end()]
        context.pos = match.end()

        # if we encounter an opening brace and we're one level
        # below a token state, it means we need to increment
        # the nesting level for braces so we know later when
        # we should return to the token rules.
        if len(stack) > 2 and stack[-2] == 'token':
            context.perl6_token_nesting_level += 1

    def closing_brace_callback(lexer, match, context):
        stack = context.stack

        yield match.start(), Text, context.text[match.start() : match.end()]
        context.pos = match.end()

        # if we encounter a free closing brace and we're one level
        # below a token state, it means we need to check the nesting
        # level to see if we need to return to the token state.
        if len(stack) > 2 and stack[-2] == 'token':
            context.perl6_token_nesting_level -= 1
            if context.perl6_token_nesting_level == 0:
                stack.pop()

    def embedded_perl6_callback(lexer, match, context):
        context.perl6_token_nesting_level = 1
        yield match.start(), Text, context.text[match.start() : match.end()]
        context.pos = match.end()
        context.stack.append('root')

    # If you're modifying these rules, be careful if you need to process '{' or '}' characters.
    # We have special logic for processing these characters (due to the fact that you can nest
    # Perl 6 code in regex blocks), so if you need to process one of them, make sure you also
    # process the corresponding one!
    tokens = {
        'common' : [
            (r'#[`|=](?P<delimiter>(?P<first_char>[' + ''.join(list(PERL6_BRACKETS.keys())) + r'])(?P=first_char)*)', brackets_callback(Comment.Multiline)),
            (r'#[^\n]*$', Comment.Singleline),
            (r'^(\s*)=begin\s+(\w+)\b.*?^\1=end\s+\2', Comment.Multiline),
            (r'^(\s*)=for.*?\n\s*?\n', Comment.Multiline),
            (r'^=.*?\n\s*?\n', Comment.Multiline),
            (r'(regex|token|rule)(\s*' + PERL6_IDENTIFIER_RANGE + '+:sym)', bygroups(Keyword, Name), 'token-sym-brackets'),
            (r'(regex|token|rule)(?!' + PERL6_IDENTIFIER_RANGE + ')(\s*' + PERL6_IDENTIFIER_RANGE + '+)?', bygroups(Keyword, Name), 'pre-token'),
            # deal with a special case in the Perl 6 grammar (role q { ... })
            (r'(role)(\s+)(q)(\s*)', bygroups(Keyword, Text, Name, Text)),
            (_build_word_match(PERL6_KEYWORDS, PERL6_IDENTIFIER_RANGE), Keyword),
            (_build_word_match(PERL6_BUILTIN_CLASSES, PERL6_IDENTIFIER_RANGE, suffix = '(?::[UD])?'), Name.Builtin),
            (_build_word_match(PERL6_BUILTINS, PERL6_IDENTIFIER_RANGE), Name.Builtin),
            # copied from PerlLexer
            (r'[$@%&][.^:?=!~]?' + PERL6_IDENTIFIER_RANGE + '+(?:<<.*?>>|<.*?>|«.*?»)*', Name.Variable),
            (r'\$[!/](?:<<.*?>>|<.*?>|«.*?»)*', Name.Variable.Global),
            (r'::\?\w+', Name.Variable.Global),
            (r'[$@%&]\*' + PERL6_IDENTIFIER_RANGE + '+(?:<<.*?>>|<.*?>|«.*?»)*', Name.Variable.Global),
            (r'\$(?:<.*?>)+', Name.Variable),
            (r'(?:q|qq|Q)[a-zA-Z]?\s*(?P<adverbs>:[\w\s:]+)?\s*(?P<delimiter>(?P<first_char>[^0-9a-zA-Z:\s])(?P=first_char)*)', brackets_callback(String)),
            # copied from PerlLexer
            (r'0_?[0-7]+(_[0-7]+)*', Number.Oct),
            (r'0x[0-9A-Fa-f]+(_[0-9A-Fa-f]+)*', Number.Hex),
            (r'0b[01]+(_[01]+)*', Number.Bin),
            (r'(?i)(\d*(_\d*)*\.\d+(_\d*)*|\d+(_\d*)*\.\d+(_\d*)*)(e[+-]?\d+)?', Number.Float),
            (r'(?i)\d+(_\d*)*e[+-]?\d+(_\d*)*', Number.Float),
            (r'\d+(_\d+)*', Number.Integer),
            (r'(?<=~~)\s*/(?:\\\\|\\/|.)*?/', String.Regex),
            (r'(?<=[=(,])\s*/(?:\\\\|\\/|.)*?/', String.Regex),
            (r'm\w+(?=\()', Name),
            (r'(?:m|ms|rx)\s*(?P<adverbs>:[\w\s:]+)?\s*(?P<delimiter>(?P<first_char>[^0-9a-zA-Z:\s])(?P=first_char)*)', brackets_callback(String.Regex)),
            (r'(?:s|ss|tr)\s*(?::[\w\s:]+)?\s*/(?:\\\\|\\/|.)*?/(?:\\\\|\\/|.)*?/', String.Regex),
            (r'<[^\s=].*?\S>', String),
            (_build_word_match(PERL6_OPERATORS), Operator),
            (r'[0-9a-zA-Z_]' + PERL6_IDENTIFIER_RANGE + '*', Name),
            (r"'(\\\\|\\[^\\]|[^'\\])*'", String),
            (r'"(\\\\|\\[^\\]|[^"\\])*"', String),
        ],
        'root' : [
            include('common'),
            (r'\{', opening_brace_callback),
            (r'\}', closing_brace_callback),
            (r'.+?', Text),
        ],
        'pre-token' : [
            include('common'),
            (r'\{', Text, ('#pop', 'token')),
            (r'.+?', Text),
        ],
        'token-sym-brackets' : [
            (r'(?P<delimiter>(?P<first_char>[' + ''.join(list(PERL6_BRACKETS.keys())) + '])(?P=first_char)*)', brackets_callback(Name), ('#pop', 'pre-token')),
            (r'', Name, ('#pop', 'pre-token')),
        ],
        'token': [
            (r'}', Text, '#pop'),
            (r'(?<=:)(?:my|our|state|constant|temp|let).*?;', using(this)),
            # make sure that quotes in character classes aren't treated as strings
            (r'<(?:[-!?+.]\s*)?\[.*?\]>', String.Regex),
            # make sure that '#' characters in quotes aren't treated as comments
            (r"(?<!\\)'(\\\\|\\[^\\]|[^'\\])*'", String.Regex),
            (r'(?<!\\)"(\\\\|\\[^\\]|[^"\\])*"', String.Regex),
            (r'#.*?$', Comment.Singleline),
            (r'\{', embedded_perl6_callback),
            ('.+?', String.Regex),
        ],
    }

    def analyse_text(text):
        def strip_pod(lines):
            in_pod         = False
            stripped_lines = []

            for line in lines:
                if re.match(r'^=(?:end|cut)', line):
                    in_pod = False
                elif re.match(r'^=\w+', line):
                    in_pod = True
                elif not in_pod:
                    stripped_lines.append(line)

            return stripped_lines

        lines = text.splitlines()
        lines = strip_pod(lines)
        text  = '\n'.join(lines)

        if shebang_matches(text, r'perl6|rakudo|niecza'):
            return True

        if 'use v6' in text:
            return 0.91 # 0.01 greater than Perl says for 'my $'
        if re.search(r'[$@%]\*[A-Z]+', text): # Perl 6-style globals ($*OS)
            return 0.91
        if re.search(r'[$@%]\?[A-Z]+', text): # Perl 6 compiler variables ($?PACKAGE)
            return 0.91
        if re.search(r'[$@%][!.][A-Za-z0-9_-]+', text): # Perl 6 member variables
            return 0.91

        for line in text.splitlines():
            if re.match(r'\s*(?:my|our)?\s*module', line): # module declarations
                return 0.91
            if re.match(r'\s*(?:my|our)?\s*role', line): # role declarations
                return 0.91
            if re.match(r'\s*(?:my|our)?\s*class\b', line): # class declarations
                return 0.91
        return False

    def __init__(self, **options):
        super(Perl6Lexer, self).__init__(**options)
        self.encoding = options.get('encoding', 'utf-8')
