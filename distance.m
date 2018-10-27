function dist=distance(matrix_1,matrix_2)
[x1,y1]=size(matrix_1);
[x2,y2]=size(matrix_2);
if(x1~=x2)
    disp('Error in matrix length dimesion')
end
dist = zeros(y1, y2);
if (y1 < y2)
    copies = zeros(1,y2);
    for n = 1:y1
        dist(n,:) = sum((matrix_1(:, n+copies) - matrix_2) .^2, 1);
    end
else
    copies = zeros(1,y1);
    for p = 1:y2
        dist(:,p) = sum((matrix_1 - matrix_2(:, p+copies)) .^2, 1);
    end
end

dist = dist.^0.5;
end