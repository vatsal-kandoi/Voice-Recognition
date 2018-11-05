function output=trainDataset(filename)
x=sprintf("upload/%s.wav",filename);
disp(x);
code1=train(x);
table=array2table(code1);
y=sprintf("trained/%s.xls",filename);
disp(y);
writetable(table,y);    
output=1;
end