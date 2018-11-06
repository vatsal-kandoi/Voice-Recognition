function output=trainDataset(filename)
x=sprintf("upload/%s.wav",filename);
disp(x);
code1=train(x);
disp(code1);
y=sprintf("trained/%s.csv",filename);
disp(y);
csvwrite(y,code1);    
output=1;
end