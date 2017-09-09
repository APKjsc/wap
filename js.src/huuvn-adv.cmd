java -jar d://com.jar --js huu.js --js_output_file temp.js --compilation_level ADVANCED_OPTIMIZATIONS --language_out=ES5 --externs ext.js
java -jar d://yui.jar -o huu.min.js temp.js --nomunge
del temp.js
pause
