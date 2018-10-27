function output=trainDataset(filename)
disp(filename);
x=sprintf("upload/%s.wav",filename);
code1=train(x);
x=sprintf("trained/%s.csv",filename);
csvwrite(x,code1);    
output=1;
end