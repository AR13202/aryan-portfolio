import os
from PIL import Image, ImageDraw, ImageFilter, ImageColor

# Directory configurations
media_dir = "C:/Users/acer/.gemini/antigravity-ide/brain/6d6b698d-3774-4db7-96d6-f0a4f020bd5d"
output_dir = "c:/Users/acer/Desktop/Aryan/portfolio-new/public/images"

def create_gradient(width, height, start_color, end_color):
    """Creates a linear gradient from top-left to bottom-right."""
    base = Image.new("RGBA", (width, height))
    draw = ImageDraw.Draw(base)
    
    c1 = ImageColor.getrgb(start_color)
    c2 = ImageColor.getrgb(end_color)
    
    # Simple linear interpolation along the diagonal
    for y in range(height):
        for x in range(width):
            # Calculate distance ratio along the diagonal
            t = (x / width + y / height) / 2.0
            r = int(c1[0] + (c2[0] - c1[0]) * t)
            g = int(c1[1] + (c2[1] - c1[1]) * t)
            b = int(c1[2] + (c2[2] - c1[2]) * t)
            draw.point((x, y), fill=(r, g, b, 255))
            
    return base

def make_browser_window(screenshot_path, target_width, corner_radius=12, dark_mode=False):
    """
    Loads a screenshot, adds a Mac-style titlebar (light or dark mode), rounds the corners,
    and returns the window image with transparent background.
    """
    img = Image.open(screenshot_path).convert("RGBA")
    
    # Calculate height to keep aspect ratio
    aspect = img.height / img.width
    target_height = int(target_width * aspect)
    img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Titlebar configuration
    titlebar_height = 24
    win_width = target_width
    win_height = target_height + titlebar_height
    
    # Create combined window canvas
    window = Image.new("RGBA", (win_width, win_height), (0, 0, 0, 0))
    
    # Draw title bar based on theme
    if dark_mode:
        tb_color = (30, 41, 59, 255)  # slate-800
        sep_color = (15, 23, 42, 255) # slate-900
        outline_color = (71, 85, 105, 255) # slate-600
    else:
        tb_color = (248, 250, 252, 255) # slate-50
        sep_color = (226, 232, 240, 255) # slate-200
        outline_color = (203, 213, 225, 255) # slate-300
        
    titlebar = Image.new("RGBA", (win_width, titlebar_height), tb_color)
    draw_tb = ImageDraw.Draw(titlebar)
    
    # Draw macOS style window controls (red, yellow, green dots)
    dot_radius = 4
    dot_y = titlebar_height // 2
    dots = [
        (14, (239, 68, 68, 255)),   # Red
        (26, (245, 158, 11, 255)),  # Yellow
        (38, (16, 185, 129, 255))   # Green
    ]
    for x_center, color in dots:
        draw_tb.ellipse(
            [x_center - dot_radius, dot_y - dot_radius, x_center + dot_radius, dot_y + dot_radius],
            fill=color
        )
        
    # Draw a subtle separator line at the bottom of the title bar
    draw_tb.line([(0, titlebar_height - 1), (win_width, titlebar_height - 1)], fill=sep_color)
    
    # Paste title bar and screenshot together
    window.paste(titlebar, (0, 0))
    window.paste(img, (0, titlebar_height))
    
    # Create rounded corner mask
    mask = Image.new("L", (win_width, win_height), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rounded_rectangle([0, 0, win_width, win_height], corner_radius, fill=255)
    
    # Apply mask to window
    final_window = Image.new("RGBA", (win_width, win_height), (0, 0, 0, 0))
    final_window.paste(window, (0, 0), mask=mask)
    
    # Add a thin 1px border around the rounded window to keep it crisp
    border = Image.new("RGBA", (win_width, win_height), (0, 0, 0, 0))
    draw_border = ImageDraw.Draw(border)
    draw_border.rounded_rectangle([0, 0, win_width - 1, win_height - 1], corner_radius, outline=outline_color, width=1)
    
    final_window = Image.alpha_composite(final_window, border)
    return final_window

def paste_with_shadow(bg, window, x, y, shadow_radius=20, shadow_offset=(0, 6), shadow_opacity=0.15):
    """Pastes the window onto the background with a soft Gaussian-blurred shadow."""
    win_w, win_h = window.size
    
    # Create shadow canvas
    shadow_canvas_w = win_w + shadow_radius * 4
    shadow_canvas_h = win_h + shadow_radius * 4
    shadow_canvas = Image.new("RGBA", (shadow_canvas_w, shadow_canvas_h), (0, 0, 0, 0))
    
    # Draw a black rounded rectangle representing the window shadow source
    shadow_draw = ImageDraw.Draw(shadow_canvas)
    shadow_draw.rounded_rectangle(
        [shadow_radius * 2, shadow_radius * 2, shadow_radius * 2 + win_w, shadow_radius * 2 + win_h],
        radius=12,
        fill=(0, 0, 0, int(255 * shadow_opacity))
    )
    
    # Blur the shadow
    shadow_canvas = shadow_canvas.filter(ImageFilter.GaussianBlur(shadow_radius))
    
    # Paste shadow onto bg
    shadow_x = x - shadow_radius * 2 + shadow_offset[0]
    shadow_y = y - shadow_radius * 2 + shadow_offset[1]
    bg.paste(shadow_canvas, (shadow_x, shadow_y), mask=shadow_canvas)
    
    # Paste window onto bg
    bg.paste(window, (x, y), mask=window)

def build_inventory_case():
    print("Building inventory-case-v2.png...")
    # Base canvas
    bg = create_gradient(1200, 800, "#f8fafc", "#bfdbfe")
    
    # Load and scale windows
    # Left: Companies
    win_left = make_browser_window(os.path.join(media_dir, "media__1781109753676.png"), target_width=680)
    # Right: Add Bill
    win_right = make_browser_window(os.path.join(media_dir, "media__1781109748861.png"), target_width=680)
    # Center Front: Dashboard
    win_center = make_browser_window(os.path.join(media_dir, "media__1781109756102.png"), target_width=840)
    
    # Paste left & right windows first (background layer)
    paste_with_shadow(bg, win_left, x=60, y=90, shadow_radius=15, shadow_opacity=0.12)
    paste_with_shadow(bg, win_right, x=460, y=90, shadow_radius=15, shadow_opacity=0.12)
    
    # Paste center window on top (foreground layer)
    paste_with_shadow(bg, win_center, x=180, y=260, shadow_radius=25, shadow_opacity=0.18)
    
    # Save output
    bg.convert("RGB").save(os.path.join(output_dir, "inventory-case-v2.png"), "PNG", quality=95)
    print("Saved inventory-case-v2.png successfully.")

def build_active_case():
    print("Building active-case-v2.png...")
    # Base canvas
    bg = create_gradient(1200, 800, "#f8fafc", "#cbd5e1")
    
    # Load and scale windows
    # Left: Clean 3D view
    win_left = make_browser_window(os.path.join(media_dir, "media__1781110271294.png"), target_width=680)
    # Right: Dimensions overlay
    win_right = make_browser_window(os.path.join(media_dir, "media__1781110584619.png"), target_width=680)
    # Center Front: Customizer with selector
    win_center = make_browser_window(os.path.join(media_dir, "media__1781110545280.png"), target_width=840)
    
    # Paste left & right windows first (background layer)
    paste_with_shadow(bg, win_left, x=60, y=90, shadow_radius=15, shadow_opacity=0.12)
    paste_with_shadow(bg, win_right, x=460, y=90, shadow_radius=15, shadow_opacity=0.12)
    
    # Paste center window on top (foreground layer)
    paste_with_shadow(bg, win_center, x=180, y=260, shadow_radius=25, shadow_opacity=0.18)
    
    # Save output
    bg.convert("RGB").save(os.path.join(output_dir, "active-case-v2.png"), "PNG", quality=95)
    print("Saved active-case-v2.png successfully.")

def build_pricing_case():
    print("Building pricing-calculator-case-v2.png...")
    # Base canvas
    bg = create_gradient(1200, 800, "#f8fafc", "#bfdbfe")
    
    # Load and scale single window
    win_center = make_browser_window(os.path.join(media_dir, "media__1781111047995.png"), target_width=800)
    
    # Paste centered in canvas
    win_w, win_h = win_center.size
    x = (1200 - win_w) // 2
    y = (800 - win_h) // 2
    
    paste_with_shadow(bg, win_center, x=x, y=y, shadow_radius=25, shadow_opacity=0.18)
    
    # Save output
    bg.convert("RGB").save(os.path.join(output_dir, "pricing-calculator-case-v2.png"), "PNG", quality=95)
    print("Saved pricing-calculator-case-v2.png successfully.")

def build_mattress_case():
    print("Building mattress-case-v2.png...")
    # Base canvas
    bg = create_gradient(1200, 800, "#f8fafc", "#c7d2fe")
    
    # Load and scale windows
    # Left: Contour selection view
    win_left = make_browser_window(os.path.join(media_dir, "media__1781111509441.png"), target_width=680)
    # Right: Measurements view
    win_right = make_browser_window(os.path.join(media_dir, "media__1781111556483.png"), target_width=680)
    # Center Front: Exploded layers view
    win_center = make_browser_window(os.path.join(media_dir, "media__1781111447063.png"), target_width=840)
    
    # Paste left & right windows first (background layer)
    paste_with_shadow(bg, win_left, x=60, y=90, shadow_radius=15, shadow_opacity=0.12)
    paste_with_shadow(bg, win_right, x=460, y=90, shadow_radius=15, shadow_opacity=0.12)
    
    # Paste center window on top (foreground layer)
    paste_with_shadow(bg, win_center, x=180, y=260, shadow_radius=25, shadow_opacity=0.18)
    
    # Save output
    bg.convert("RGB").save(os.path.join(output_dir, "mattress-case-v2.png"), "PNG", quality=95)
    print("Saved mattress-case-v2.png successfully.")

def build_solarsystem_case():
    print("Building solarsystem-case-v3.png...")
    from PIL import ImageOps
    # Load the close-up screenshot
    img = Image.open(os.path.join(media_dir, "media__1781111821456.png")).convert("RGB")
    
    # Fit the image to cover the 1200x800 canvas perfectly
    final_img = ImageOps.fit(img, (1200, 800), method=Image.Resampling.LANCZOS)
    
    # Save output
    final_img.save(os.path.join(output_dir, "solarsystem-case-v3.png"), "PNG", quality=95)
    print("Saved solarsystem-case-v3.png successfully.")

if __name__ == "__main__":
    os.makedirs(output_dir, exist_ok=True)
    build_inventory_case()
    build_active_case()
    build_pricing_case()
    build_mattress_case()
    build_solarsystem_case()
