function output=testset()
v = train("/upload/input.wav");
distmin = inf;
k1 = 0;
files = dir('trained');
[m,n]=size(files);
for i=3:m
    disp(files(i).name);
    x=sprintf('/trained/%s',files(i).name);
    data=csvread(x);
    disp(data);
    %GET THE EUCLIDEAN DISTANCE
    d = distance(v,data);
    %SUM OF MIN VALUE OF EACH ROW BY SIZE OF COLUMS
    dist = sum(min(d,[],2)) / size(d,1);
    if dist < distmin
        distmin=dist;
        k1=i;
    end
end
fileID = fopen('exp.txt','w');
disp(distmin);
if(distmin<inf)
    disp("MATCH");
    fprintf(fileID,'%s',files(k1).name);
else
    disp("NOMATCH");
    fprintf(fileID,'NOMATCH');
end
fclose(fileID);
output=1;
end