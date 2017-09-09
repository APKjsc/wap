
java -jar d://com.jar --js ob.js --js_output_file temp.js --compilation_level SIMPLE_OPTIMIZATIONS --language_out=ES5
java -jar d://yui.jar -o ob.min.js temp.js --nomunge
del temp.js

pause
