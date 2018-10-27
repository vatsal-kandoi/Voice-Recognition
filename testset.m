function output=testset(filename)
[s,fs]=audioread("upload/input.wav");
v = findmfcc(s, fs);
distmin = inf;
k1 = 0;
files = dir('trained');
[m,n]=size(files);
for i=3:m
    data=csvread(files(i).name+".csv");
    d = distance(v,data);
    dist = sum(min(d,[],2)) / size(d,1);
    if dist < distmin
        distmin=dist;
        k1=i;
    end
end
fileID = fopen('exp.txt','w');
if(distmin<2.5)
    fprintf(fileID,'%s',files(k1).name);
else
    fprintf(fileID,'NOMATCH');
end
fclose(fileID);
end